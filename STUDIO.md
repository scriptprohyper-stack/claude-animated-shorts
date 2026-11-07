# Faceless YouTube Shorts Studio

Mobile-controllable production studio for 9:16 cartoon shorts in the
"2D characters in a colourful 3D world" style. Renders with
Remotion + three.js. **Claude is the only AI used** — no external video
generators.

## Stack

| Piece | Version | Role |
|---|---|---|
| Node.js | 22.x | Runtime for Remotion / bundler |
| Remotion | 4.0.411 | Composition + render pipeline → MP4 (H.264) |
| @remotion/three | 4.0.411 | ThreeCanvas: react-three-fiber as a Remotion layer |
| @react-three/fiber | 8.17.10 | React renderer for three.js (pinned to R18-compatible) |
| three | 0.170 | 3D engine |
| Python 3 | 3.12 | SKILL scripts (QA, sheets, audio synthesis) |
| FFmpeg | 6+ | Mux / preview extraction |

## Layout

```
.
├── src/
│   ├── index.ts            # Remotion entry (registerRoot)
│   ├── Root.tsx            # Compositions
│   └── CartoonTest.tsx     # 3s proof-of-pipeline scene
├── remotion.config.ts      # Render defaults
├── .claude/skills/cartoon-3d-short/
│   ├── SKILL.md            # Full pipeline (installed skill)
│   ├── templates/          # bridge/* source, audio/* synth, scripts/*
│   └── references/         # STYLE_BIBLE, reports, frames, sheets
└── .github/workflows/render.yml  # CI render + MP4 artifact
```

## Local use

```bash
npm install                        # one-off
npm run studio                     # open Remotion Studio in the browser
npm run render:test                # render CartoonTest to out/test.mp4
npm run render:test-2k             # 2K final: 1440x2560, scale 1.3333, CRF 16
```

Manual render with the full flag set:

```bash
npx remotion render src/index.ts <CompositionId> out/<name>.mp4 \
  --codec h264 --crf 16 --scale 1.3333
```

## Rendering from your phone (GitHub Actions)

1. On GitHub, open the repo → **Actions** → **Render Short** → **Run workflow**.
2. Pick composition id (default `CartoonTest`), scale (`1` preview, `1.3333`
   final 2K), CRF (18 preview, 16 final).
3. When the run finishes, download the artifact — it contains `*.mp4`
   and a preview `*.jpg`.

Any push that changes `src/**`, `package*.json`, `remotion.config.ts`, or
the workflow file also triggers an auto render.

## Verified on this setup

- `npx tsc --noEmit` — clean.
- `npx remotion render ... CartoonTest out/test.mp4 --codec h264 --crf 23`
  on Node 22, Linux, headless Chromium → **576 KB MP4, H.264, 1080×1920,
  30 fps, 3 s**, containing bean-head character billboard + painted 3D
  town + smootherstep camera glide (see `out/preview.jpg`).

## Making a new short

The installed skill handles the full pipeline. In a new session:

> *"Use the cartoon short skill and make a short about …"*

Claude then follows `.claude/skills/cartoon-3d-short/SKILL.md`: topic &
facts → script → voice → `story.ts` shot plan → world/character code →
stills → sound → 2K render. New composition goes in
`src/videos/<name>/` and registers next to `CartoonTest` in `Root.tsx`.

## Disk note (per SKILL)

Each Remotion bundle copies `public/` into the OS temp dir and doesn't
clean up. On long projects, set:

```bash
export TEMP=/big-drive/remotion-tmp TMP=/big-drive/remotion-tmp
```

Delete finished projects' `remotion-webpack-bundle-*` and
`puppeteer_dev_chrome_profile-*` folders when idle.
