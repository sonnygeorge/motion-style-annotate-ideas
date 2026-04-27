#!/usr/bin/env node
// Scans ../data, ensures public/data points at it (symlink, fall back to copy),
// and writes public/manifest.json describing every folder with >= 2 .mp4 files.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const publicDir = path.join(root, "public");
const publicData = path.join(publicDir, "data");
const manifestPath = path.join(publicDir, "manifest.json");

function splitSlug(slug) {
  // dataset = before first '-', task = remainder. Handles e.g. "robo-arena-foo".
  const dash = slug.indexOf("-");
  if (dash === -1) return { dataset: slug, task: "" };
  return { dataset: slug.slice(0, dash), task: slug.slice(dash + 1) };
}

async function ensurePublicData() {
  await fs.mkdir(publicDir, { recursive: true });
  try {
    const stat = await fs.lstat(publicData);
    if (stat.isSymbolicLink()) {
      const target = await fs.readlink(publicData);
      const resolved = path.resolve(publicDir, target);
      if (resolved === dataDir) return "symlink (already linked)";
      await fs.unlink(publicData);
    } else {
      // Either a real dir/file we previously copied — leave as-is on Windows,
      // but on POSIX prefer a fresh symlink so updates show up in dev.
      if (process.platform !== "win32") {
        await fs.rm(publicData, { recursive: true, force: true });
      } else {
        return "existing copy (left in place)";
      }
    }
  } catch {
    // doesn't exist — fall through to create
  }

  try {
    await fs.symlink(path.relative(publicDir, dataDir), publicData, "dir");
    return "symlink";
  } catch (err) {
    console.warn(
      `[sync-data] symlink failed (${err.code || err.message}), falling back to copy`,
    );
    await fs.cp(dataDir, publicData, { recursive: true });
    return "copy";
  }
}

async function buildManifest() {
  const entries = await fs.readdir(dataDir, { withFileTypes: true });
  const pairs = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dirPath = path.join(dataDir, e.name);
    const files = (await fs.readdir(dirPath))
      .filter((f) => f.toLowerCase().endsWith(".mp4"))
      .sort();
    if (files.length < 2) continue;
    const { dataset, task } = splitSlug(e.name);
    pairs.push({
      slug: e.name,
      dataset,
      task,
      videoA: `data/${e.name}/${files[0]}`,
      videoB: `data/${e.name}/${files[1]}`,
    });
  }
  pairs.sort((a, b) => a.slug.localeCompare(b.slug));
  await fs.writeFile(manifestPath, JSON.stringify(pairs, null, 2) + "\n");
  return pairs.length;
}

const linkMode = await ensurePublicData();
const count = await buildManifest();
console.log(`[sync-data] ${linkMode}; ${count} pair(s) → ${path.relative(root, manifestPath)}`);
