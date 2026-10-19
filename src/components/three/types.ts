export type SceneState = {
  /** 0 = hero pose, 1 = sitting at the desk */
  desk: number;
  /** horizontal offset of the rig in world units */
  offsetX: number;
  /** extra yaw applied to the whole rig */
  turn: number;
  /** clock time at which the current wave started (-1 = none) */
  waveAt: number;
  /** where the hands land when typing (rig space) — props like the desk line up to it */
  deskAnchor?: [number, number, number] | null;
};

export const WAVE_LEN = 2.8;
