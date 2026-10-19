import {
  siAngular,
  siBootstrap,
  siCss,
  siDocker,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLua,
  siMongodb,
  siMysql,
  siNextdotjs,
  siVite,
  siFramer,
  siReactquery,
  siTailwindcss,
  siNodedotjs,
  siOpenjdk,
  siPandas,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siScikitlearn,
  siSocketdotio,
  siTensorflow,
  siTypescript,
  siWebpack,
} from "simple-icons";

export type TechIcon = { path: string; color: string };

const brand = (icon: { path: string; hex: string }, override?: string): TechIcon => ({
  path: icon.path,
  color: override ?? `#${icon.hex}`,
});

// Generic glyphs for tools without a brand icon (24×24 viewBox)
const custom = {
  bucket:
    "M4 5c0-1.7 3.6-3 8-3s8 1.3 8 3l-2 14c0 1.7-2.7 3-6 3s-6-1.3-6-3L4 5zm8 2c3.3 0 6-.9 6-2s-2.7-2-6-2-6 .9-6 2 2.7 2 6 2z",
  queue: "M3 4h18v4H3zM3 10h13v4H3zM3 16h8v4H3zM18 11l4 3-4 3z",
  database:
    "M12 2C7 2 4 3.3 4 5v14c0 1.7 3 3 8 3s8-1.3 8-3V5c0-1.7-3-3-8-3zm0 2c3.9 0 6 .9 6 1s-2.1 1-6 1-6-.9-6-1 2.1-1 6-1zM6 8.3C7.5 8.8 9.6 9 12 9s4.5-.2 6-.7V12c0 .1-2.1 1-6 1s-6-.9-6-1V8.3zm0 6c1.5.5 3.6.7 6 .7s4.5-.2 6-.7V19c0 .1-2.1 1-6 1s-6-.9-6-1v-4.7z",
  braces:
    "M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2v2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2v-2H6v-4a3 3 0 0 0-1.3-2.5A3 3 0 0 0 6 9V5h2zm8 0h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2v2a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-4a3 3 0 0 1 1.3-2.5A3 3 0 0 1 18 9V5h-2z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  shield: "M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z",
};

export const techIcons: Record<string, TechIcon> = {
  "Node.js": brand(siNodedotjs),
  TypeScript: brand(siTypescript),
  JavaScript: brand(siJavascript),
  Java: brand(siOpenjdk, "#f89820"),
  Python: brand(siPython, "#4b8bbe"),
  SQL: { path: custom.database, color: "#38bdf8" },
  Express: brand(siExpress, "#e5e7eb"),
  "Express.js": brand(siExpress, "#e5e7eb"),
  React: brand(siReact),
  "React.js": brand(siReact),
  Angular: brand(siAngular, "#dd0031"),
  MongoDB: brand(siMongodb),
  MySQL: brand(siMysql, "#4f9fd8"),
  Redis: brand(siRedis),
  BullMQ: { path: custom.queue, color: "#f43f5e" },
  "AWS S3": { path: custom.bucket, color: "#ff9900" },
  Docker: brand(siDocker),
  Git: brand(siGit),
  WebSockets: brand(siSocketdotio, "#c4b5fd"),
  JWT: brand(siJsonwebtokens, "#fb7185"),
  "JWT Auth": brand(siJsonwebtokens, "#fb7185"),
  REST: { path: custom.braces, color: "#4ade80" },
  "REST APIs": { path: custom.braces, color: "#4ade80" },
  SSE: { path: custom.bolt, color: "#facc15" },
  RBAC: { path: custom.shield, color: "#34d399" },
  Postman: brand(siPostman),
  Webpack: brand(siWebpack),
  HTML: brand(siHtml5),
  CSS: brand(siCss, "#a78bfa"),
  Bootstrap: brand(siBootstrap, "#a07bf7"),
  Lua: brand(siLua, "#6b8cff"),
  "Lua Scripts": brand(siLua, "#6b8cff"),
  GitHub: brand(siGithub, "#f5f5f5"),
  TensorFlow: brand(siTensorflow),
  "Scikit-learn": brand(siScikitlearn),
  Pandas: brand(siPandas, "#e70488"),
  Webhooks: { path: custom.bolt, color: "#f472b6" },
  "REST API": { path: custom.braces, color: "#4ade80" },
  "Next.js": brand(siNextdotjs, "#f5f5f5"),
  Vite: brand(siVite, "#bd34fe"),
  "Framer Motion": brand(siFramer, "#e94bf0"),
  "TanStack Query": brand(siReactquery),
  "Tailwind CSS": brand(siTailwindcss),
};

export function iconFor(name: string): TechIcon | undefined {
  return techIcons[name];
}
