"use client";

import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Character from "./Character";
import Desk from "./Desk";
import GlbAvatar from "./GlbAvatar";
import { WAVE_LEN, type SceneState } from "./types";
import { attachPointer, clamp01, smooth } from "./pointer";
import { useLoaded } from "@/components/fx/LoadState";

const shapes = [
  { kind: "torus", pos: [-1.35, 2.75, -1.6], color: "#22d3ee", scale: 0.2, speed: 1.6 },
  { kind: "ico", pos: [1.45, 2.6, -1.8], color: "#f472b6", scale: 0.22, speed: 1.3 },
  { kind: "octa", pos: [-1.4, 0.7, -1.4], color: "#fbbf24", scale: 0.17, speed: 1.9 },
  { kind: "sphere", pos: [1.5, 0.95, -1.2], color: "#a78bfa", scale: 0.15, speed: 1.5 },
  { kind: "knot", pos: [0.75, 3.45, -2.4], color: "#34d399", scale: 0.13, speed: 1.2 },
  { kind: "cone", pos: [-0.8, 3.5, -2.4], color: "#fb7185", scale: 0.15, speed: 1.7 },
] as const;

function Shape({ kind }: { kind: (typeof shapes)[number]["kind"] }) {
  switch (kind) {
    case "torus":
      return <torusGeometry args={[1, 0.38, 32, 64]} />;
    case "ico":
      return <icosahedronGeometry args={[1, 0]} />;
    case "octa":
      return <octahedronGeometry args={[1, 0]} />;
    case "sphere":
      return <sphereGeometry args={[1, 48, 32]} />;
    case "knot":
      return <torusKnotGeometry args={[1, 0.32, 128, 24]} />;
    case "cone":
      return <coneGeometry args={[0.9, 1.6, 4]} />;
  }
}

function FloatingShapes({ group }: { group: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={2} floatIntensity={1.4} position={s.pos as unknown as [number, number, number]}>
          <mesh scale={s.scale}>
            <Shape kind={s.kind} />
            <meshPhysicalMaterial
              color={s.color}
              roughness={0.12}
              metalness={0.2}
              clearcoat={1}
              iridescence={1}
              iridescenceIOR={1.4}
              emissive={s.color}
              emissiveIntensity={0.35}
            />
          </mesh>
        </Float>
      ))}
      <Sparkles count={40} scale={[7, 4.5, 3]} position={[0, 1.6, -1]} size={4} speed={0.5} color="#c084fc" />
      <Sparkles count={30} scale={[7, 4.5, 3]} position={[0, 1.6, -1]} size={3} speed={0.6} color="#22d3ee" />
      <Sparkles count={25} scale={[7, 4.5, 3]} position={[0, 1.6, -1]} size={3.5} speed={0.4} color="#fbbf24" />
    </group>
  );
}

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
  const shapesRef = useRef<THREE.Group>(null);
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
      // park the desk scene ~22% from the left edge, whatever the window width
      const vw = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 1, 0)).width;
      st.offsetX = (0.2 - 0.5) * vw * deskT;
      opacity = clamp01((whatido.bottom - vh * 0.3) / (vh * 0.45));
    } else {
      // phones: the desk scene plays in an empty band at the top of About,
      // then fades before the About text scrolls over it
      st.desk = deskT;
      // he turns side-on with the laptop on his far side; shift left to keep both in frame
      st.offsetX = -0.9 * deskT;
      opacity = 1 - clamp01((-about.top - vh * 0.35) / (vh * 0.3));
    }
    if (container.current) {
      container.current.style.opacity = String(opacity);
      container.current.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
    }

    // Wave on intro, then roughly every 12s while the hero is in view
    if (nextWave.current >= 0 && t >= nextWave.current) {
      if (deskT < 0.1) st.waveAt = t;
      nextWave.current = t + WAVE_LEN + 9;
    }

    const d = Math.min(delta, 0.05);
    const camZ = desktop ? THREE.MathUtils.lerp(6.0, 6.6, deskT) : THREE.MathUtils.lerp(12.5, 11, deskT);
    const camY = desktop ? THREE.MathUtils.lerp(1.35, 1.45, deskT) : 1.25;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 4, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 4, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, d);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, desktop ? THREE.MathUtils.lerp(1.15, 0.85, deskT) : THREE.MathUtils.lerp(1.1, 0.7, deskT), 4, d);
    camera.lookAt(lookAt.current);

    if (intro.current) {
      const target = loaded ? 1 : 0;
      const s = THREE.MathUtils.damp(intro.current.scale.x, 0.4 + 0.6 * target, 3, d);
      intro.current.scale.setScalar(s);
      intro.current.position.y = THREE.MathUtils.damp(intro.current.position.y, loaded ? 0 : -2.5, 3, d);
    }
    if (shapesRef.current) {
      // shapes drift apart and fade out of the way as the desk scene comes in
      const target = loaded ? Math.max(0.001, 1 - deskT * 1.4) : 0.001;
      shapesRef.current.scale.setScalar(THREE.MathUtils.damp(shapesRef.current.scale.x, target, 4, d));
      shapesRef.current.position.x = THREE.MathUtils.damp(shapesRef.current.position.x, st.offsetX * 0.4, 3, d);
    }
  });

  return (
    <>
      <FloatingShapes group={shapesRef} />
      <group ref={intro} scale={0.4} position={[0, -2.5, 0]}>
        {avatarUrl ? (
          <Suspense fallback={<Character state={state} />}>
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
    </>
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
        dpr={[1, 1.4]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 1.35, 6], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 4, 6]} intensity={1.7} color="#fff7ed" />
        <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#e9d5ff" />
        {/* colourful studio rim lights */}
        <pointLight position={[-3, 2.2, -1.5]} intensity={45} distance={12} color="#a855f7" />
        <pointLight position={[3, 1.6, -1.5]} intensity={40} distance={12} color="#ec4899" />
        <pointLight position={[0, 3.5, -2]} intensity={22} distance={10} color="#22d3ee" />
        <pointLight position={[2.5, -0.5, 1.5]} intensity={8} distance={6} color="#fbbf24" />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[6, 2, 1]} color="#ffffff" />
          <Lightformer form="ring" intensity={3} position={[-5, 1, -2]} scale={3} color="#a855f7" />
          <Lightformer form="ring" intensity={3} position={[5, 1, -2]} scale={3} color="#f472b6" />
          <Lightformer form="rect" intensity={2} position={[0, -3, 2]} scale={[6, 1, 1]} color="#22d3ee" />
        </Environment>
        <Director state={state} container={container} loaded={loaded} avatarUrl={avatarUrl} />
      </Canvas>
    </div>
  );
}
