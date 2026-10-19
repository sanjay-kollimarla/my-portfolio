"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Preloader from "./Preloader";

const LoadedContext = createContext(false);

export function useLoaded() {
  return useContext(LoadedContext);
}

export default function LoadState({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <LoadedContext.Provider value={loaded}>
        <AnimatePresence>{!loaded && <Preloader key="preloader" onDone={done} />}</AnimatePresence>
        {children}
      </LoadedContext.Provider>
    </MotionConfig>
  );
}
