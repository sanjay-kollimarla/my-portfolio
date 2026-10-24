"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneState } from "./types";

function useScreenTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 512, 320);
    g.addColorStop(0, "#140b24");
    g.addColorStop(1, "#1d0f33");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 320);
    const colors = ["#c4b5fd", "#f0abfc", "#67e8f9", "#86efac", "#fcd34d"];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 13; i++) {
      let x = 28 + (i % 4 === 0 ? 0 : 26) + (i % 3) * 8;
      const y = 26 + i * 22;
      const segs = 2 + Math.floor(rnd() * 3);
      for (let s = 0; s < segs; s++) {
        const w = 30 + rnd() * 90;
        ctx.fillStyle = colors[Math.floor(rnd() * colors.length)];
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, w, 9);
        x += w + 12;
      }
    }
    ctx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

type Mats = Record<"alu" | "aluDark" | "bezel" | "keycap" | "pad" | "logo" | "cam", THREE.Material>;

/** Space-grey laptop: backlit keyboard, trackpad, hinge, bezel, webcam, glowing lid logo. */
function Laptop({
  m,
  screenRef,
  screenTex,
}: {
  m: Mats;
  screenRef: React.RefObject<THREE.Mesh | null>;
  screenTex: THREE.Texture | null;
}) {
  const W = 0.92;
  const D = 0.62;
  return (
    <group position={[0, 0.305, 1.22]} rotation={[0, Math.PI, 0]}>
      {/* base */}
      <RoundedBox args={[W, 0.032, D]} radius={0.014} material={m.alu} position={[0, 0.016, 0]} />
      {/* keyboard well + keys */}
      <mesh material={m.aluDark} position={[0, 0.0325, 0.03]}>
        <boxGeometry args={[W * 0.86, 0.002, D * 0.42]} />
      </mesh>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 13 }, (_, c) => {
          const kw = (W * 0.84) / 13;
          const isSpace = r === 4 && c >= 4 && c <= 8;
          if (r === 4 && c > 4 && c <= 8) return null;
          return (
            <RoundedBox
              key={`${r}-${c}`}
              args={[isSpace ? kw * 5 - 0.008 : kw - 0.008, 0.008, (D * 0.4) / 5 - 0.008]}
              radius={0.003}
              material={m.keycap}
              position={[-W * 0.42 + kw * (isSpace ? c + 2 : c) + kw / 2, 0.037, -D * 0.2 + 0.03 + r * ((D * 0.4) / 5) + (D * 0.4) / 10]}
            />
          );
        })
      )}
      {/* trackpad */}
      <RoundedBox args={[W * 0.36, 0.003, D * 0.25]} radius={0.002} material={m.pad} position={[0, 0.0335, D * 0.33]} />
      {/* hinge */}
      <mesh material={m.aluDark} position={[0, 0.03, -D / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, W * 0.8, 16]} />
      </mesh>
      {/* lid, opened ~110deg, screen facing the user (-z side is the back) */}
      <group position={[0, 0.03, -D / 2 + 0.01]} rotation={[-0.32, 0, 0]}>
        <RoundedBox args={[W, D * 0.98, 0.018]} radius={0.012} material={m.alu} position={[0, (D * 0.98) / 2, -0.009]} />
        <mesh material={m.bezel} position={[0, (D * 0.98) / 2, 0.0005]}>
          <planeGeometry args={[W * 0.97, D * 0.95]} />
        </mesh>
        <mesh ref={screenRef} position={[0, (D * 0.98) / 2 - 0.006, 0.0015]}>
          <planeGeometry args={[W * 0.92, D * 0.84]} />
          <meshBasicMaterial map={screenTex ?? undefined} toneMapped={false} />
        </mesh>
        <mesh material={m.cam} position={[0, D * 0.955, 0.002]}>
          <circleGeometry args={[0.004, 12]} />
        </mesh>
        {/* glowing logo on the back of the lid */}
        <mesh material={m.logo} position={[0, (D * 0.98) / 2, -0.0185]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.04, 32]} />
        </mesh>
        <pointLight position={[0, D * 0.5, 0.25]} intensity={1.6} distance={1.4} color="#cfd8ff" />
      </group>
    </group>
  );
}

/** Glass desk with a laptop and a coffee mug that rise in for the "at work" pose. */
export default function Desk({
  state,
  scale = 1,
  position = [0, 0, 0],
  chair = null,
  legsTo = null,
}: {
  state: React.RefObject<SceneState>;
  scale?: number;
  position?: [number, number, number];
  /** seat position (desk-local units) — renders an office chair when set */
  chair?: [number, number, number] | null;
  /** floor height (desk-local units) — renders standing-desk legs down to it */
  legsTo?: number | null;
}) {
  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.Mesh>(null);
  const steam = useRef<THREE.Group>(null);
  const screenTex = useScreenTexture();

  const m = useMemo(
    () => ({
      desk: new THREE.MeshPhysicalMaterial({ color: "#b99b78", roughness: 0.55, metalness: 0.0, clearcoat: 0.15 }),
      mug: new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", roughness: 0.25, clearcoat: 1 }),
      coffee: new THREE.MeshStandardMaterial({ color: "#3b2416", roughness: 0.2 }),
      alu: new THREE.MeshPhysicalMaterial({ color: "#5b5f6b", metalness: 0.85, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
      aluDark: new THREE.MeshPhysicalMaterial({ color: "#2a2c33", metalness: 0.8, roughness: 0.4 }),
      bezel: new THREE.MeshPhysicalMaterial({ color: "#0b0b0f", roughness: 0.15, clearcoat: 1 }),
      keycap: new THREE.MeshStandardMaterial({ color: "#16161c", roughness: 0.55, emissive: "#334155", emissiveIntensity: 0.08 }),
      pad: new THREE.MeshPhysicalMaterial({ color: "#6b7080", metalness: 0.6, roughness: 0.18, clearcoat: 1 }),
      logo: new THREE.MeshBasicMaterial({ color: "#e7e5df" }),
      cam: new THREE.MeshBasicMaterial({ color: "#22c55e" }),
      chair: new THREE.MeshPhysicalMaterial({ color: "#2a2a2e", roughness: 0.5, clearcoat: 0.3 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#2b2b30", metalness: 0.7, roughness: 0.35 }),
    }),
    []
  );

  useFrame((s) => {
    const st = state.current;
    const t = s.clock.elapsedTime;
    if (!st || !group.current) return;
    const k = THREE.MathUtils.smoothstep(st.desk, 0.15, 1);
    group.current.visible = k > 0.01;
    group.current.scale.setScalar(scale * (0.6 + 0.4 * k));
    // follow the character's measured typing position when it provides one:
    // keyboard (desk-local 0, 0.38, 0.95) sits just under the hands
    const a = st.deskAnchor;
    const px = a ? a[0] : position[0];
    // palms rest on the table top (y 0.305) near its front edge (z 0.72)
    const py = a ? a[1] - 0.33 * scale : position[1];
    const pz = a ? a[2] - 0.72 * scale : position[2];
    group.current.position.set(px, py - 1.6 * scale * (1 - k), pz);
    if (screen.current) (screen.current.material as THREE.MeshBasicMaterial).color.setScalar(0.85 + Math.sin(t * 2) * 0.08);
    steam.current?.children.forEach((c, i) => {
      const ph = (t * 0.6 + i / 3) % 1;
      c.position.set(Math.sin(t * 2 + i * 2) * 0.03, 0.12 + ph * 0.35, 0);
      c.scale.setScalar(0.03 + ph * 0.05);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - ph);
    });
  });

  return (
    <group ref={group} visible={false}>
      <mesh material={m.desk} position={[0, 0.28, 1.15]}>
        <boxGeometry args={[2.0, 0.05, 1.0]} />
      </mesh>
      <Laptop m={m} screenRef={screen} screenTex={screenTex} />
      <group position={[0.75, 0.42, 1.05]}>
        <mesh material={m.mug}>
          <cylinderGeometry args={[0.09, 0.08, 0.2, 24]} />
        </mesh>
        <mesh material={m.coffee} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 24]} />
        </mesh>
        <mesh material={m.mug} position={[0.1, 0, 0]}>
          <torusGeometry args={[0.05, 0.016, 8, 16]} />
        </mesh>
        <group ref={steam}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <sphereGeometry args={[1, 12, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>
      {legsTo !== null && (
        <>
          {[-0.85, 0.85].map((x) => (
            <group key={x} position={[x, 0, 1.15]}>
              <mesh material={m.chrome} position={[0, (0.28 + legsTo) / 2, 0]}>
                <boxGeometry args={[0.07, 0.28 - legsTo, 0.07]} />
              </mesh>
              <mesh material={m.chrome} position={[0, legsTo + 0.015, 0]}>
                <boxGeometry args={[0.1, 0.03, 0.85]} />
              </mesh>
            </group>
          ))}
          <mesh material={m.chair} position={[0, 0.2, 1.15]}>
            <boxGeometry args={[1.75, 0.08, 0.06]} />
          </mesh>
        </>
      )}
      {chair && (
        <group position={chair}>
          <RoundedBox args={[0.62, 0.08, 0.58]} radius={0.04} material={m.chair} />
          <RoundedBox args={[0.6, 0.62, 0.07]} radius={0.04} material={m.chair} position={[0, 0.38, -0.3]} rotation={[-0.1, 0, 0]} />
          <mesh material={m.chrome} position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.5, 12]} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} material={m.chrome} position={[Math.cos((i / 5) * Math.PI * 2) * 0.17, -0.53, Math.sin((i / 5) * Math.PI * 2) * 0.17]} rotation={[0, -(i / 5) * Math.PI * 2, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.34, 8]} />
            </mesh>
          ))}
        </group>
      )}
      <pointLight position={[0, 1.05, 1.3]} intensity={1.2} distance={2.5} color="#ffffff" />
    </group>
  );
}
