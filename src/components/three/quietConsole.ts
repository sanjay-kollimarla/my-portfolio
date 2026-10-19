import { setConsoleFunction } from "three";

/**
 * Silences two harmless three.js warnings that we can't fix from app code:
 *  - "THREE.Clock ... deprecated": emitted by @react-three/fiber itself (latest 9.x still
 *    creates a THREE.Clock internally). Goes away when fiber switches to THREE.Timer.
 *  - "warning X4122 ... double precision": Windows' Direct3D shader compiler (via ANGLE)
 *    noting a rounding detail in three's built-in shaders. Informational only.
 * Everything else is passed through to the console unchanged.
 */
const IGNORED = [/THREE\.Clock: This module has been deprecated/, /warning X4122/];

setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
  const text = [message, ...params].map(String).join(" ");
  if (IGNORED.some((re) => re.test(text))) return;
  const fn = (console as unknown as Record<string, (...a: unknown[]) => void>)[type] ?? console.log;
  fn(message, ...params);
});
