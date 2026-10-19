"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { pointer } from "./pointer";
import { WAVE_LEN, type SceneState } from "./types";

export type { SceneState };
export { WAVE_LEN };

const UP = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3();

/** Stretches a unit-height mesh between two points. */
function placeSegment(mesh: THREE.Object3D | null, a: THREE.Vector3, b: THREE.Vector3) {
  if (!mesh) return;
  tmp.copy(b).sub(a);
  const len = tmp.length();
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(UP, tmp.normalize());
}

function irisTexture() {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  g.addColorStop(0, "#1a0d06");
  g.addColorStop(0.28, "#5a3014");
  g.addColorStop(0.62, "#8a5426");
  g.addColorStop(0.9, "#3c1f0c");
  g.addColorStop(1, "#1a0d06");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();
  // fibres
  ctx.strokeStyle = "rgba(255,200,140,0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 40, 128 + Math.sin(a) * 40);
    ctx.lineTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110);
    ctx.stroke();
  }
  // pupil
  ctx.fillStyle = "#050302";
  ctx.beginPath();
  ctx.arc(128, 128, 46, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function useMaterials() {
  return useMemo(() => {
    const iris = irisTexture();
    return {
      skin: new THREE.MeshPhysicalMaterial({
        color: "#e0a47c",
        roughness: 0.45,
        clearcoat: 0.12,
        clearcoatRoughness: 0.6,
        sheen: 0.7,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color("#ffb69a"),
      }),
      lip: new THREE.MeshPhysicalMaterial({ color: "#b8574a", roughness: 0.3, clearcoat: 0.5 }),
      cheek: new THREE.MeshStandardMaterial({ color: "#ff7a85", transparent: true, opacity: 0.3, roughness: 1, depthWrite: false }),
      hoodie: new THREE.MeshPhysicalMaterial({
        color: "#7c3aed",
        roughness: 0.78,
        sheen: 1,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#c4b5fd"),
      }),
      lining: new THREE.MeshPhysicalMaterial({ color: "#e11d48", roughness: 0.7, sheen: 1, sheenColor: new THREE.Color("#fda4af") }),
      tee: new THREE.MeshPhysicalMaterial({ color: "#f8fafc", roughness: 0.8, sheen: 0.5, sheenColor: new THREE.Color("#e0e7ff") }),
      string: new THREE.MeshStandardMaterial({ color: "#f5f5f4", roughness: 0.6 }),
      hair: new THREE.MeshPhysicalMaterial({
        color: "#1c1416",
        roughness: 0.55,
        clearcoat: 0.3,
        clearcoatRoughness: 0.5,
        sheen: 1,
        sheenRoughness: 0.35,
        sheenColor: new THREE.Color("#6b4a5a"),
      }),
      beard: new THREE.MeshPhysicalMaterial({ color: "#4a3226", roughness: 1, transparent: true, opacity: 0.55, sheen: 0.3, sheenColor: new THREE.Color("#6b4a37") }),
      eyeWhite: new THREE.MeshPhysicalMaterial({ color: "#fdfcfa", roughness: 0.08, clearcoat: 1 }),
      iris: new THREE.MeshBasicMaterial({ map: iris ?? undefined, color: iris ? "#ffffff" : "#5a3014", transparent: true }),
      shine: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      mouth: new THREE.MeshStandardMaterial({ color: "#3a1210", roughness: 0.6 }),
      teeth: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.2, clearcoat: 1 }),
      tongue: new THREE.MeshStandardMaterial({ color: "#e0607a", roughness: 0.5 }),
      frame: new THREE.MeshPhysicalMaterial({ color: "#3b1d6e", roughness: 0.15, clearcoat: 1, metalness: 0.2 }),
      lens: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.02,
        transparent: true,
        opacity: 0.12,
        clearcoat: 1,
        iridescence: 1,
        iridescenceIOR: 1.6,
        side: THREE.DoubleSide,
      }),
      lash: new THREE.MeshStandardMaterial({ color: "#120a10", roughness: 0.5 }),
    };
  }, []);
}

// hair clumps placed on the scalp: polar angle from the top, azimuth (0 = front), size, sweep
export default function Character({ state, children }: { state: React.RefObject<SceneState>; children?: React.ReactNode }) {
  const m = useMaterials();

  const rig = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const lidL = useRef<THREE.Mesh>(null);
  const lidR = useRef<THREE.Mesh>(null);
  const browL = useRef<THREE.Mesh>(null);
  const browR = useRef<THREE.Mesh>(null);
  const smile = useRef<THREE.Group>(null);
  const strings = useRef<THREE.Group>(null);

  const armParts = useRef<{ upper: THREE.Mesh | null; fore: THREE.Mesh | null; elbow: THREE.Mesh | null; cuff: THREE.Mesh | null; hand: THREE.Group | null; fingers: THREE.Group | null }[]>([
    { upper: null, fore: null, elbow: null, cuff: null, hand: null, fingers: null },
    { upper: null, fore: null, elbow: null, cuff: null, hand: null, fingers: null },
  ]);

  const arms = useMemo(
    () =>
      ([-1, 1] as const).map((side) => ({
        shoulder: new THREE.Vector3(0.72 * side, 0.58, 0),
        restElbow: new THREE.Vector3(0.88 * side, -0.05, 0.08),
        restHand: new THREE.Vector3(0.86 * side, -0.66, 0.22),
        typeElbow: new THREE.Vector3(0.78 * side, 0.12, 0.55),
        typeHand: new THREE.Vector3(0.24 * side, 0.4, 1.0),
      })),
    []
  );
  const v = useMemo(
    () => ({
      elbow: [new THREE.Vector3(), new THREE.Vector3()],
      hand: [new THREE.Vector3(), new THREE.Vector3()],
      wElbow: new THREE.Vector3(),
      wHand: new THREE.Vector3(),
      c1: new THREE.Vector3(),
      c2: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    }),
    []
  );

  const blink = useRef({ next: 2.5, t: -1 });
  const look = useRef({ x: 0, y: 0 });
  const waveT = useRef(0);

  const geo = useMemo(() => {
    const torso = new THREE.LatheGeometry(
      [
        [0, 1.0],
        [0.3, 0.98],
        [0.62, 0.9],
        [0.86, 0.7],
        [0.98, 0.4],
        [1.0, 0.0],
        [0.96, -0.6],
        [0.9, -1.2],
        [0, -1.2],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
      72
    );
    torso.scale(1, 1, 0.7);
    torso.computeVertexNormals();
    return {
      torso,
      hairCap: new THREE.SphereGeometry(0.625, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.5),
      lid: new THREE.SphereGeometry(0.152, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      lowerLid: new THREE.SphereGeometry(0.152, 32, 16, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28),
      stubble: new THREE.SphereGeometry(1, 64, 32, Math.PI / 2 - 1.7, 3.4, Math.PI * 0.45, Math.PI * 0.55),
      finger: new THREE.CapsuleGeometry(0.034, 0.09, 6, 12),
      thumb: new THREE.CapsuleGeometry(0.038, 0.07, 6, 12),
    };
  }, []);

  useFrame((s, delta) => {
    const st = state.current;
    const t = s.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    if (!rig.current || !head.current || !st) return;

    const since = st.waveAt >= 0 ? t - st.waveAt : -1;
    const waving = since >= 0 && since <= WAVE_LEN && st.desk < 0.2;
    waveT.current = THREE.MathUtils.damp(waveT.current, waving ? 1 : 0, 6, d);
    const w = waveT.current;

    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, st.offsetX, 4, d);
    const yaw = st.desk * 1.2 + st.turn + pointer.x * 0.08 * (1 - st.desk) - w * 0.15;
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, yaw, 4, d);
    rig.current.position.y = Math.sin(t * 1.2) * 0.02 + w * Math.abs(Math.sin(t * 4.5)) * 0.025;

    if (torso.current) torso.current.scale.set(1 + Math.sin(t * 1.6) * 0.01, 1 + Math.sin(t * 1.6) * 0.014, 1);
    if (strings.current) strings.current.rotation.x = Math.sin(t * 1.6) * 0.04 + w * Math.sin(t * 9) * 0.08;

    const lx = THREE.MathUtils.lerp(pointer.x * 0.55, pointer.x * 0.12, st.desk);
    const ly = THREE.MathUtils.lerp(pointer.y * 0.32, -0.12 + pointer.y * 0.05, st.desk);
    look.current.x = THREE.MathUtils.damp(look.current.x, lx * (1 - w * 0.6), 5, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, ly * (1 - w * 0.6), 5, d);
    head.current.rotation.y = look.current.x;
    head.current.rotation.x = -look.current.y;
    head.current.rotation.z = -look.current.x * 0.08 + Math.sin(t * 0.7) * 0.025 + w * 0.12;

    for (const e of [eyeL.current, eyeR.current]) {
      if (!e) continue;
      e.rotation.y = look.current.x * 0.7;
      e.rotation.x = -look.current.y * 0.7;
    }

    const b = blink.current;
    if (b.t < 0 && t > b.next) b.t = 0;
    let close = 0;
    if (b.t >= 0) {
      b.t += d;
      close = Math.sin(Math.min(1, b.t / 0.16) * Math.PI);
      if (b.t > 0.16) {
        b.t = -1;
        b.next = t + 2 + Math.random() * 3.5;
      }
    }
    const lidRot = THREE.MathUtils.lerp(-0.25 - w * 0.15 + st.desk * 0.1, 1.45, close);
    if (lidL.current) lidL.current.rotation.x = lidRot;
    if (lidR.current) lidR.current.rotation.x = lidRot;

    const browY = 0.12 + pointer.y * 0.015 * (1 - st.desk) + w * 0.035;
    if (browL.current) browL.current.position.y = browY;
    if (browR.current) browR.current.position.y = browY;
    if (smile.current) smile.current.scale.set(1 + w * 0.1, 1 + w * 0.35, 1);

    arms.forEach((arm, i) => {
      const side = i === 0 ? -1 : 1;
      const elbow = v.elbow[i];
      const hand = v.hand[i];
      elbow.lerpVectors(arm.restElbow, arm.typeElbow, st.desk);
      hand.lerpVectors(arm.restHand, arm.typeHand, st.desk);
      if (st.desk > 0.6) hand.y += Math.sin(t * 14 + i * 1.7) * 0.025 * st.desk;
      hand.x += Math.sin(t * 3 + i) * 0.02 * st.desk * side;
      let spread = 0;
      if (i === 1 && w > 0.001) {
        v.wElbow.set(1.15, 0.95, 0.25);
        v.wHand.set(1.0 + Math.sin(t * 10) * 0.16, 1.6, 0.35);
        elbow.lerp(v.wElbow, w);
        hand.lerp(v.wHand, w);
        spread = w;
      }
      const p = armParts.current[i];
      placeSegment(p.upper, arm.shoulder, elbow);
      v.c1.lerpVectors(elbow, hand, 0.82);
      placeSegment(p.fore, elbow, v.c1);
      v.c2.lerpVectors(elbow, hand, 0.97);
      placeSegment(p.cuff, v.c1, v.c2);
      p.elbow?.position.copy(elbow);
      if (p.hand) {
        p.hand.position.copy(v.c2);
        v.dir.copy(hand).sub(elbow).normalize();
        p.hand.quaternion.setFromUnitVectors(UP, v.dir);
        if (i === 1) p.hand.rotateY(-w * 0.4);
      }
      p.fingers?.children.forEach((f, fi) => {
        const base = (fi - 1.5) * 0.12;
        f.rotation.z = base * (0.4 + spread) - side * 0.05;
        f.rotation.x = 0.35 * (1 - spread) + (st.desk > 0.6 ? Math.sin(t * 14 + fi) * 0.25 : 0);
      });
    });
  });

  return (
    <group ref={rig}>
      {children}
      {/* ---------- Hoodie ---------- */}
      <group ref={torso}>
        <mesh geometry={geo.torso} material={m.hoodie} position={[0, -0.12, 0]} scale={[0.88, 1, 0.9]} />
        {/* neck + tee peeking out */}
        <mesh material={m.skin} position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.17, 0.2, 0.42, 32]} />
        </mesh>
        <mesh material={m.tee} position={[0, 0.82, 0.24]} scale={[0.2, 0.12, 0.08]}>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
        {/* hood roll with red lining */}
        <mesh material={m.hoodie} position={[0, 0.9, -0.05]} rotation={[Math.PI / 2 + 0.25, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.38, 0.15, 24, 64]} />
        </mesh>
        <mesh material={m.lining} position={[0, 0.94, 0.0]} rotation={[Math.PI / 2 + 0.25, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.3, 0.075, 16, 64]} />
        </mesh>
        {/* drawstrings */}
        <group ref={strings} position={[0, 0.84, 0.36]}>
          {[-1, 1].map((s) => (
            <group key={s} position={[0.11 * s, 0, 0]} rotation={[0.3, 0, 0.04 * s]}>
              <mesh material={m.string} position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />
              </mesh>
              <mesh material={m.lining} position={[0, -0.42, 0]}>
                <cylinderGeometry args={[0.022, 0.018, 0.07, 10]} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ---------- Arms + hands ---------- */}
      {[0, 1].map((i) => (
        <group key={i}>
          <mesh material={m.hoodie} position={arms[i].shoulder}>
            <sphereGeometry args={[0.25, 32, 16]} />
          </mesh>
          <mesh ref={(r) => { armParts.current[i].upper = r; }} material={m.hoodie}>
            <cylinderGeometry args={[0.22, 0.19, 1, 28]} />
          </mesh>
          <mesh ref={(r) => { armParts.current[i].elbow = r; }} material={m.hoodie}>
            <sphereGeometry args={[0.19, 24, 16]} />
          </mesh>
          <mesh ref={(r) => { armParts.current[i].fore = r; }} material={m.hoodie}>
            <cylinderGeometry args={[0.18, 0.15, 1, 28]} />
          </mesh>
          <mesh ref={(r) => { armParts.current[i].cuff = r; }} material={m.lining}>
            <cylinderGeometry args={[0.155, 0.155, 1, 28]} />
          </mesh>
          <group ref={(r) => { armParts.current[i].hand = r; }}>
            {/* palm */}
            <mesh material={m.skin} position={[0, 0.1, 0]} scale={[0.115, 0.12, 0.07]}>
              <sphereGeometry args={[1, 24, 16]} />
            </mesh>
            {/* fingers */}
            <group ref={(r) => { armParts.current[i].fingers = r; }} position={[0, 0.19, 0]}>
              {[0, 1, 2, 3].map((f) => (
                <group key={f} position={[(f - 1.5) * 0.055, 0, 0]}>
                  <mesh geometry={geo.finger} material={m.skin} position={[0, 0.06 + (f === 1 || f === 2 ? 0.01 : 0), 0]} scale={[1, f === 0 || f === 3 ? 0.85 : 1, 1]} />
                </group>
              ))}
            </group>
            <mesh geometry={geo.thumb} material={m.skin} position={[(i === 0 ? 1 : -1) * 0.1, 0.09, 0.03]} rotation={[0.3, 0, (i === 0 ? -1 : 1) * 0.9]} />
          </group>
        </group>
      ))}

      {/* ---------- Head ---------- */}
      <group ref={head} position={[0, 1.62, 0]} scale={1.1}>
        <mesh material={m.skin} scale={[0.93, 1.0, 0.9]}>
          <sphereGeometry args={[0.6, 72, 56]} />
        </mesh>
        <mesh material={m.skin} position={[0, -0.18, 0.06]} scale={[0.5, 0.39, 0.45]}>
          <sphereGeometry args={[1, 56, 40]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={`ck${s}`} material={m.cheek} position={[0.3 * s, -0.16, 0.44]} scale={[0.085, 0.05, 0.04]}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
        ))}

        {/* trimmed beard */}
        <mesh geometry={geo.stubble} material={m.beard} position={[0, -0.18, 0.06]} scale={[0.5 * 1.025, 0.39 * 1.025, 0.45 * 1.025]} />
        {[-1, 1].map((s) => (
          <mesh key={`mo${s}`} material={m.beard} position={[0.06 * s, -0.17, 0.545]} rotation={[0, 0.2 * s, -0.2 * s]} scale={[0.075, 0.02, 0.028]}>
            <sphereGeometry args={[1, 20, 10]} />
          </mesh>
        ))}

        {/* smile */}
        <group ref={smile} position={[0, -0.25, 0.515]} rotation={[0.25, 0, 0]}>
          <mesh material={m.mouth} scale={[0.12, 0.065, 0.04]}>
            <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          </mesh>
          <mesh material={m.teeth} position={[0, -0.008, 0.014]} scale={[0.1, 0.022, 0.028]}>
            <sphereGeometry args={[1, 24, 10]} />
          </mesh>
          <mesh material={m.tongue} position={[0, -0.045, 0.012]} scale={[0.06, 0.018, 0.025]}>
            <sphereGeometry args={[1, 16, 8]} />
          </mesh>
          <mesh material={m.lip} position={[0, -0.068, 0.004]} scale={[0.06, 0.014, 0.02]}>
            <sphereGeometry args={[1, 16, 8]} />
          </mesh>
        </group>

        {/* stylised hair: cap + glossy teardrop clumps */}
        <mesh geometry={geo.hairCap} material={m.hair} rotation={[-0.32, 0, 0]} scale={[0.97, 1.03, 0.96]} position={[0, 0.02, -0.02]} />
        <mesh material={m.hair} position={[0, 0.02, -0.16]} scale={[0.93, 0.95, 0.8]}>
          <sphereGeometry args={[0.6, 48, 32]} />
        </mesh>
        {/* soft top volume */}
        <mesh material={m.hair} position={[0.02, 0.45, 0.02]} scale={[0.5, 0.2, 0.47]}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
        {/* fringe gently swept to the right, hiding the hairline edge */}
        <mesh material={m.hair} position={[0.06, 0.4, 0.36]} rotation={[0.55, 0, -0.18]} scale={[0.44, 0.11, 0.2]}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
        <mesh material={m.hair} position={[0.27, 0.36, 0.31]} rotation={[0.45, 0.3, -0.45]} scale={[0.22, 0.09, 0.15]}>
          <sphereGeometry args={[1, 32, 24]} />
        </mesh>
        {/* side part */}
        <mesh material={m.mouth} position={[-0.21, 0.5, 0.25]} rotation={[-0.75, 0, 0.3]} scale={[0.007, 0.01, 0.17]}>
          <sphereGeometry args={[1, 8, 8]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={`sb${s}`} material={m.hair} position={[0.505 * s, 0.05, 0.06]} scale={[0.05, 0.15, 0.1]}>
            <sphereGeometry args={[1, 16, 12]} />
          </mesh>
        ))}

        {/* ears */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.56 * s, 0.0, -0.02]} rotation={[0, 0.45 * s, 0]}>
            <mesh material={m.skin} scale={[0.075, 0.15, 0.11]}>
              <sphereGeometry args={[1, 24, 16]} />
            </mesh>
            <mesh material={m.skin} position={[0.035 * s, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.075, 0.026, 12, 24]} />
            </mesh>
          </group>
        ))}

        {/* big glossy eyes with lids */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0.2 * s, 0.04, 0.44]}>
            <group ref={s === -1 ? eyeL : eyeR}>
              <mesh material={m.eyeWhite} scale={[1, 1.05, 0.62]}>
                <sphereGeometry args={[0.14, 40, 28]} />
              </mesh>
              <mesh material={m.iris} position={[0, -0.005, 0.0875]}>
                <circleGeometry args={[0.085, 48]} />
              </mesh>
              <mesh material={m.shine} position={[0.035, 0.035, 0.09]}>
                <circleGeometry args={[0.022, 20]} />
              </mesh>
              <mesh material={m.shine} position={[-0.03, -0.035, 0.09]}>
                <circleGeometry args={[0.01, 16]} />
              </mesh>
            </group>
            <mesh ref={s === -1 ? lidL : lidR} geometry={geo.lid} material={m.skin} scale={[1, 1, 0.66]} rotation={[-0.25, 0, 0]} />
            <mesh geometry={geo.lowerLid} material={m.skin} scale={[1, 1, 0.66]} />
            {/* lash line on the upper lid */}
            <mesh material={m.lash} position={[0.015 * s, 0.1, 0.06]} rotation={[0.45, 0, 0]} scale={[1, 1, 0.66]}>
              <torusGeometry args={[0.13, 0.01, 8, 32, Math.PI]} />
            </mesh>
          </group>
        ))}

        {/* brows */}
        {[-1, 1].map((s) => (
          <mesh key={`br${s}`} ref={s === -1 ? browL : browR} material={m.hair} position={[0.2 * s, 0.12, 0.47]} rotation={[0.3, 0.2 * s, Math.PI / 2 - 0.8]}>
            <torusGeometry args={[0.13, 0.03, 12, 28, 1.6]} />
          </mesh>
        ))}

        {/* nose */}
        <mesh material={m.skin} position={[0, -0.065, 0.55]} scale={[0.085, 0.095, 0.09]}>
          <sphereGeometry args={[1, 28, 20]} />
        </mesh>

        {/* round glasses */}
        {[-1, 1].map((s) => (
          <group key={`g${s}`} position={[0.2 * s, 0.04, 0.62]} rotation={[0, -0.12 * s, 0]}>
            <mesh material={m.frame}>
              <torusGeometry args={[0.165, 0.017, 14, 64]} />
            </mesh>
            <mesh material={m.lens}>
              <circleGeometry args={[0.16, 48]} />
            </mesh>
          </group>
        ))}
        <mesh material={m.frame} position={[0, 0.07, 0.635]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.045, 0.012, 8, 20, Math.PI]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={`t${s}`} material={m.frame} position={[0.48 * s, 0.11, 0.28]} rotation={[0, -0.3 * s, 0]}>
            <boxGeometry args={[0.02, 0.025, 0.6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
