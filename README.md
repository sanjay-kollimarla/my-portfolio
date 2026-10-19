# Kollimarla Sai Sanjay — Portfolio

Next.js 16 · React Three Fiber · Framer Motion · Lenis · Tailwind v4

## Run locally

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Editing

- All text content lives in `src/data/portfolio.ts`.
- Drop a `resume.pdf` into `public/` and the **RESUME** link appears automatically.
- The 3D character is built in code in `src/components/three/Character.tsx`.
- 3D avatar: your own Avaturn export at `public/models/avatar.glb`. Replace that file with any rigged .glb to change the character (restart the server afterwards). Delete it to fall back to the built-in procedural avatar.
