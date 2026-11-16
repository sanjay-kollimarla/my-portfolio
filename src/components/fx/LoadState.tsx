"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Preloader from "./Preloader";

const LoadedContext = createContext(false);
const SceneReadyContext = createContext<() => void>(() => {});

/** The 3D scene calls this once its model is loaded and its shaders are compiled. */
export function useMarkSceneReady() {
  return useContext(SceneReadyContext);
}

export function useLoaded() {
  return useContext(LoadedContext);
}

export default function LoadState({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const done = useCallback(() => setLoaded(true), []);
  const markSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <LoadedContext.Provider value={loaded}>
        <SceneReadyContext.Provider value={markSceneReady}>
          <AnimatePresence>{!loaded && <Preloader key="preloader" ready={sceneReady} onDone={done} />}</AnimatePresence>
          {children}
        </SceneReadyContext.Provider>
      </LoadedContext.Provider>
    </MotionConfig>
  );
}
