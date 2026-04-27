import { useEffect, useState } from "react";

export type Pair = {
  slug: string;
  dataset: string;
  task: string;
  videoA: string;
  videoB: string;
};

export function humanizeTask(task: string): string {
  return task.replace(/[-_]+/g, " ").trim();
}

const manifestUrl = `${import.meta.env.BASE_URL}manifest.json`;

let cache: Promise<Pair[]> | null = null;

function loadManifest(): Promise<Pair[]> {
  if (!cache) {
    cache = fetch(manifestUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`manifest.json: ${r.status}`);
        return r.json();
      })
      .catch((err) => {
        cache = null;
        throw err;
      });
  }
  return cache;
}

export function videoUrl(relPath: string): string {
  return `${import.meta.env.BASE_URL}${relPath}`;
}

export function useManifest() {
  const [pairs, setPairs] = useState<Pair[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadManifest()
      .then((p) => {
        if (!cancelled) setPairs(p);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { pairs, error };
}
