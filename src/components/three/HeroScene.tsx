"use client";

import "./quietConsole";
import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Character from "./Character";
import Desk from "./Desk";
import GlbAvatar from "./GlbAvatar";
import { WAVE_LEN, type SceneState } from "./types";
import { attachPointer, clamp01, smooth } from "./pointer";
import { useLoaded } from "@/components/fx/LoadState";

/** Where the avatar stands on desktop, as a fraction of the viewport width. */
const HERO_X = 0.7;
const DESK_X = 0.2;

function Director({
  state,
  container,
  loaded,
  avatarUrl,
}: {
  state: React.RefObject<SceneState>;
  container: React.RefObject<HTMLDivElement | null>;
  loaded: boolean;
  avatarUrl: string | null;
}) {
  const { camera, clock, viewport } = useThree();
  const intro = useRef<THREE.Group>(null);
  const lookAt = useRef(new THREE.Vector3(0, 1.2, 0));
  const nextWave = useRef(-1);

  useEffect(() => {
    if (loaded) nextWave.current = clock.elapsedTime + 2.2;
  }, [loaded, clock]);

  useFrame((_, delta) => {
    const vh = window.innerHeight;
    const desktop = window.innerWidth >= 1024;
    const about = document.getElementById("about")?.getBoundingClientRect();
    const whatido = document.getElementById("whatido")?.getBoundingClientRect();
    const st = state.current;
    if (!about || !whatido || !st) return;

    const t = clock.elapsedTime;
    const deskT = smooth(clamp01((vh - about.top) / vh));
    let opacity: number;
    if (desktop) {
      st.desk = deskT;
      const vw = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 1, 0)).width;
      // hero: right of the headline; desk scene: left, with the About text on the right
      st.offsetX = THREE.MathUtils.lerp((HERO_X - 0.5) * vw, (DESK_X - 0.5) * vw, deskT);
      opacity = clamp01((whatido.bottom - vh * 0.3) / (vh * 0.45));
    } else {
      // phones: the desk scene plays in an empty band at the top of About,
      // then fades before the About text scrolls over it
      st.desk = deskT;
      st.offsetX = -0.9 * deskT;
      opacity = 1 - clamp01((-about.top - vh * 0.02) / (vh * 0.22));
    }
    if (container.current) {
      container.current.style.opacity = String(opacity);
      container.current.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
    }

    // Greeting on intro, then roughly every 12s while the hero is in view
    if (nextWave.current >= 0 && t >= nextWave.current) {
      if (deskT < 0.1) st.waveAt = t;
      nextWave.current = t + WAVE_LEN + 9;
    }

    const d = Math.min(delta, 0.05);
    const camZ = desktop ? THREE.MathUtils.lerp(6.0, 6.6, deskT) : THREE.MathUtils.lerp(13.2, 11, deskT);
    const camY = desktop ? THREE.MathUtils.lerp(1.35, 1.45, deskT) : 1.25;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 4, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, d);
    lookAt.current.y = THREE.MathUtils.damp(
      lookAt.current.y,
      desktop ? THREE.MathUtils.lerp(1.15, 0.85, deskT) : THREE.MathUtils.lerp(2.55, 0.7, deskT),
      4,
      d
    );
    camera.lookAt(lookAt.current);

    if (intro.current) {
      const target = loaded ? 1 : 0;
      const s = THREE.MathUtils.damp(intro.current.scale.x, 0.4 + 0.6 * target, 3, d);
      intro.current.scale.setScalar(s);
      intro.current.position.y = THREE.MathUtils.damp(intro.current.position.y, loaded ? 0 : -2.5, 3, d);
    }
  });

  return (
    <group ref={intro} scale={0.4} position={[0, -2.5, 0]}>
      {avatarUrl ? (
        <Suspense fallback={null}>
          <GlbAvatar url={avatarUrl} state={state}>
            {/* standing desk sized for a full-body character; turns and moves with him */}
            <Desk state={state} scale={1.2} position={[0, 0.21, -0.15]} legsTo={-6} />
          </GlbAvatar>
        </Suspense>
      ) : (
        <Character state={state}>
          <Desk state={state} />
        </Character>
      )}
    </group>
  );
}

export default function HeroScene({ avatarUrl = null }: { avatarUrl?: string | null }) {
  const loaded = useLoaded();
  const container = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState>({ desk: 0, offsetX: 0, turn: 0, waveAt: -1 });

  useEffect(() => attachPointer(), []);

  // the scene is only visible in the hero + about/desk area: stop rendering everywhere else
  const [active, setActive] = useState(true);
  useEffect(() => {
    const check = () => {
      const vh = window.innerHeight;
      const desktop = window.innerWidth >= 1024;
      const whatido = document.getElementById("whatido")?.getBoundingClientRect();
      const about = document.getElementById("about")?.getBoundingClientRect();
      if (!whatido || !about) return;
      setActive(desktop ? whatido.bottom > vh * 0.25 : about.top > -vh * 0.7);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div ref={container} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 1.35, 6], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        {/* soft studio light for a paper-white page: warm key, cool fill, faint blue rim */}
        <ambientLight intensity={1.0} />
        <directionalLight position={[3, 4, 5]} intensity={2.1} color="#fff4e6" />
        <directionalLight position={[-4, 2, 3]} intensity={0.8} color="#e8eeff" />
        <pointLight position={[-3, 2.5, -2]} intensity={46} distance={12} color="#6b8cff" />
        <directionalLight position={[0, 3, -4]} intensity={1.8} color="#9db4ff" />
        <pointLight position={[3, 1.5, -2]} intensity={26} distance={10} color="#ffc48a" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.4} position={[0, 4, 4]} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.4} position={[-5, 1, 2]} scale={[2, 5, 1]} color="#e6ecff" />
          <Lightformer form="rect" intensity={1.2} position={[5, 1, 2]} scale={[2, 5, 1]} color="#fff0dc" />
        </Environment>
        <Director state={state} container={container} loaded={loaded} avatarUrl={avatarUrl} />
      </Canvas>
    </div>
  );
}
