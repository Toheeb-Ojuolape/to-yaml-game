# to-yaml

A small game for learning YAML: you're shown random JSON, you type its YAML
equivalent, and correct answers unlock the next level. 20 hand-written levels
across four difficulty tiers (Novice → Master), with per-device profiles,
stars/XP, and a standalone JSON ⇄ YAML converter outside the game flow.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (custom "Developer Console" theme — see `src/index.css`)
- Framer Motion for animation
- [`@catalystic/json-to-yaml`](https://www.npmjs.com/package/@catalystic/json-to-yaml) for JSON → YAML conversion
- [`js-yaml`](https://www.npmjs.com/package/js-yaml) for YAML → JSON parsing
- Everything is persisted client-side in `localStorage` — no backend

Answers are checked semantically (parse the player's YAML, deep-equal it
against the level's JSON) rather than by string diff, since valid YAML has
many equivalent forms.

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build         # typecheck + production build
npm run lint          # oxlint
npm run format        # prettier --write
npm run format:check  # prettier --check (used in CI)
npm run test          # vitest, watch mode
npm run test:run      # vitest, single run (used in CI)
```

## Project layout

- `src/data/samples.ts` — the 20 JSON levels
- `src/lib/` — YAML conversion, deep-equal, scoring, localStorage, syntax highlighting
- `src/context/ProfileContext.tsx` — profiles, XP, progress, unlock state
- `src/components/game/` — level map, play screen, hints, results
- `src/components/converter/` — the standalone JSON ⇄ YAML tool
- `*.test.ts(x)` files are colocated next to the code they cover; `src/test/setup.ts` wires up
  `@testing-library/jest-dom` and jsdom stubs for Vitest

## CI/CD

- **`.github/workflows/ci.yml`** — on every push/PR to `main`: lint, format check, test, build.
  This is the merge gate; it doesn't deploy anything.
- **Deployment is via Netlify**, connected directly to this repo (build command `npm run build`,
  publish directory `dist`, configured in `netlify.toml`). Netlify builds and deploys on every
  push automatically — no GitHub Actions involved. `netlify.toml` also adds the SPA fallback
  redirect (`/* → /index.html`) that client-side routing needs on any static host.
