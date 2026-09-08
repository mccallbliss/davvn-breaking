# breaking.davvn.com — React + Vite app

The davvn interactive EP, built as a Vite + React + TypeScript SPA.
This is the **post-launch / growth** version of the experience. (For the
zero-build launch page, see the sibling static `breaking-davvn/` repo.)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typechecks (tsc) then builds to dist/
npm run preview    # serve the production build locally
```

## Deploy (Vercel)

Import the repo in Vercel — framework preset **Vite** (auto-detected), build
`npm run build`, output `dist`. Then **Settings → Domains → Add**
`breaking.davvn.com` and add the CNAME Vercel shows. `vercel.json` already
handles SPA routing (so `/town`, `/dive` deep-link correctly) and long-caches
`/assets`.

Share links point at `https://breaking.davvn.com` via `src/lib/config.ts` —
change `BASE_URL` there if the path ever moves.

## How it's organized

```
src/
├── main.tsx              # entry
├── App.tsx              # router + global Atmosphere; routes / /town /dive
├── index.css           # the whole Silent Hill × Twilight stylesheet
├── lib/                 # ← portable, framework-agnostic logic (no React)
│   ├── songs.ts         #   tracks, letters, openers
│   ├── frames.ts        #   choice framings, wounds, first-notes
│   ├── archetypes.ts    #   the 7 fates + hidden Glitch, isGlitch/archOf
│   ├── cutcode.ts       #   encode/decode DVN·XXXXXXX, share URLs
│   ├── config.ts        #   BASE_URL
│   ├── town.ts          #   town graph: nodes, edges, fog threshold
│   └── useEpBuilder.ts  #   the build state machine (React hook)
├── components/          # presentational pieces
│   ├── Atmosphere.tsx   #   fog / grain / vignette layers
│   ├── Shell.tsx        #   the PS2 system-window chrome
│   ├── MemoryCard.tsx   #   save-data tray
│   ├── SaveFile.tsx     #   result card
│   └── ShareCard.tsx    #   9:16 export modal
├── features/
│   └── Explorer.tsx     # the game itself (wound → build → fate → gallery/decode)
└── routes/
    ├── Home.tsx         # landing: hero + Explorer + fates strip + footer
    ├── Town.tsx         # STUB — Tier 2 fog-of-war map lands here
    └── Dive.tsx         # STUB — Tier 3 dive moments + <video> cutscenes
```

The **`lib/` folder is the whole point of the migration**: your cut-code,
archetype, and sequencing logic is pure TypeScript with zero React in it, so
it's reusable in the town map, the dives, or anywhere else later.

## Growing into the town + dives

- **Cutscenes:** drop `<video>` into `Dive.tsx` (or any screen). Files go in
  `public/assets/video/`. The global grain/vignette can sit over raw footage so
  web and social share the same treatment.
- **Town map (done):** `/town` is a playable fog-of-war map — places are tracks
  (from `lib/town.ts`), the fog lifts where you walk, and leaving on a track
  gives that track's fate. What's left is *art*: swap the placeholder nodes for
  real located scenes and give the roads mood. Logic lives in `Town.tsx`.
- **Free-roam (only if you want a walkable avatar):** add a `src/game/` folder
  and mount a **Phaser** (or Pixi) canvas inside `Town.tsx`. Everything else
  stays as-is; the save/deep-link layer is shared.

## Before launch checklist

- Wire real links where `data-social` appears in `Home.tsx`.
- Add `public/og.png` (1200×630) for link previews.
- Turn on Vercel Analytics to see which endings fans build.
