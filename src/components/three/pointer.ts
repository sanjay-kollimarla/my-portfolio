// Window-level pointer shared with the 3D scenes. The canvases ignore pointer
// events so the page underneath stays clickable, so they read from here instead.
export const pointer = { x: 0, y: 0, clientX: -9999, clientY: -9999 };

let attached = false;

export function attachPointer() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    pointer.clientX = e.clientX;
    pointer.clientY = e.clientY;
  });
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (t: number) => t * t * (3 - 2 * t);
