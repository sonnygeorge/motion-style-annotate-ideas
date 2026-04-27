# Motion-style annotation UI ideas

A static, GitHub-Pages-hostable React + Vite site that demos different
annotation UIs for comparing pairs of robot-trajectory videos. Each demo
loads the video pairs from `data/`, lets you click through them via a
dropdown selector, and "submits" by advancing to the next pair (without
recording anything). The point is to give collaborators a feel for each
interaction in practice with a few real video pairs.

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:5173
```

`npm run dev` and `npm run build` both first run `scripts/sync-data.mjs`,
which:

1. Symlinks `public/data → ../data` (falls back to a copy on Windows).
2. Writes `public/manifest.json`, listing every folder in `data/` that
   contains at least two `.mp4` files.

If you add or rename data folders while the dev server is running,
re-run `npm run sync` (or just restart `npm run dev`) to refresh the
manifest.

## Demos

Routes use a hash router so they work at any GitHub Pages base path:

- `#/` — index of demos
- `#/open-ended-1` — open-ended motion / execution-style differences
- `#/carefulness-1` — single-axis "carefulness" comparison

## Adding a new variant

1. Copy an existing page, e.g. `src/pages/OpenEnded1.tsx` →
   `src/pages/OpenEnded2.tsx`, and tweak the form.
2. Register it in [`src/App.tsx`](src/App.tsx) by adding an entry to
   the `routes` array (path, title, blurb, category, element). Both the
   router and the home-page card grid read from this same registry.
3. That's it — no other wiring needed.

## Project layout

```
data/                            source of truth for video pairs (untouched)
public/data/                     symlink to ../data, generated
public/manifest.json             generated list of pairs
scripts/sync-data.mjs            generator script
src/
  App.tsx                        HashRouter + routes registry
  manifest.ts                    typed loader for manifest.json
  components/
    Layout.tsx                   header + back-to-home + page title
    VideoPair.tsx                side-by-side <video> elements
    PairSelector.tsx             dropdown over manifest
    SubmitBar.tsx                "no meaningful difference" + Submit
    Toast.tsx                    transient submit confirmation
  pages/
    Home.tsx                     card grid driven by routes registry
    OpenEnded1.tsx               UI #1
    Carefulness1.tsx             UI #2
```

## Deploying to GitHub Pages

The site uses `base: './'` in [`vite.config.ts`](vite.config.ts) and a
`HashRouter`, so it works at any Pages URL with no further configuration.

One-time setup for a fresh repo:

```bash
git init
git remote add origin git@github.com:<user>/<repo>.git
git add -A && git commit -m "initial"
git push -u origin main
```

Then any time you want to publish:

```bash
npm run deploy
```

This runs `vite build` and then `gh-pages -d dist`, pushing the contents
of `dist/` (including the videos) to the `gh-pages` branch. In the repo
settings, set Pages to serve from the `gh-pages` branch.

The site will be available at `https://<user>.github.io/<repo>/`.

### A note on data size

`data/` is currently ~189 MB. That's well under GitHub Pages' 1 GB soft
limit and no single file is over the 100 MB hard limit, so plain Pages
hosting is fine — no LFS needed. If `data/` grows much beyond a few
hundred MB, consider hosting the videos elsewhere and updating
`scripts/sync-data.mjs` to emit absolute URLs in `manifest.json`.
