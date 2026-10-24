# Kollimarla Sai Sanjay — Portfolio

Next.js 16 · React Three Fiber · Framer Motion · Lenis · Tailwind v4

## Run locally (uses [Bun](https://bun.sh))

Install Bun once: `npm install -g bun` (or see bun.sh). Then:

```bash
bun install      # first time only
bun run dev      # http://localhost:3000
```

Production build:

```bash
bun run build
bun run start
```

## Editing

- All text content lives in `src/data/portfolio.ts`.
- Drop a `resume.pdf` into `public/` and the **RESUME** link appears automatically.
- The 3D character is built in code in `src/components/three/Character.tsx`.
- 3D avatar: your own Avaturn export at `public/models/avatar.glb`. Replace that file with any rigged .glb to change the character (restart the server afterwards). Delete it to fall back to the built-in procedural avatar.
