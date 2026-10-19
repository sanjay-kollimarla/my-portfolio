"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { pointer } from "./pointer";
import { WAVE_LEN, type SceneState } from "./types";
import { addFace, addGlasses, smoothShading, upgradeMaterials, type FaceRig } from "./avatarEnhance";

type Pose = { upper: THREE.Quaternion; fore: THREE.Quaternion };
type ArmRig = {
  upper: THREE.Bone;
  fore: THREE.Bone;
  side: 1 | -1;
  down: Pose;
  type: Pose;
  waveA: Pose;
  waveB: Pose;
  hand: THREE.Object3D;
  finger: THREE.Object3D | null;
  /** load-time (T/A-pose) local rotations: aiming from here keeps every rotation < 90 deg */
  bind: [THREE.Quaternion, THREE.Quaternion, THREE.Quaternion];
};

const deskDirs = (side: number) => ({
  upper: new THREE.Vector3(0.22 * side, -0.85, 0.5),
  fore: new THREE.Vector3(0.12 * side, -0.4, 1),
  hand: new THREE.Vector3(0.08 * side, -0.25, 1),
});

/** Bend the upper spine forward (toward +z, the way the character faces). */
function leanSpine(spine: THREE.Bone[], space: THREE.Object3D, amount: number) {
  spine.forEach((b) => {
    const child = b.children.find((c) => (c as THREE.Bone).isBone);
    if (!child) return;
    const from = b.quaternion.clone();
    aimLive(b, child, new THREE.Vector3(0, 1, 0.2), space, _t);
    b.quaternion.copy(from).slerp(_t, amount);
  });
}

/**
 * Pose one arm by aiming upper arm, forearm and hand along model-space directions.
 * Each bone starts from its bind rotation so the aim never has to flip 180 degrees
 * (which twists the arm unpredictably), then blends in from `from` by `amount`.
 */
const _t = new THREE.Quaternion();
function poseArm(
  arm: ArmRig,
  space: THREE.Object3D,
  dirs: { upper: THREE.Vector3; fore: THREE.Vector3; hand: THREE.Vector3 },
  amount: number
) {
  const steps: [THREE.Object3D, THREE.Object3D | null, THREE.Vector3, THREE.Quaternion][] = [
    [arm.upper, arm.fore, dirs.upper, arm.bind[0]],
    [arm.fore, arm.hand, dirs.fore, arm.bind[1]],
    [arm.hand, arm.finger, dirs.hand, arm.bind[2]],
  ];
  for (const [bone, child, dir, bind] of steps) {
    if (!child || !(bone as THREE.Bone).isBone) continue;
    const from = bone.quaternion.clone();
    bone.quaternion.copy(bind);
    aimLive(bone as THREE.Bone, child, dir, space, _t);
    bone.quaternion.copy(from).slerp(_t, amount);
  }
}

/**
 * Live aim: the local rotation that points `bone` (toward `child`) along `dir`, where `dir`
 * is given in the model's own space. Uses the *current* pose of the parents, so it stays
 * correct on top of any idle animation that moves shoulders or spine.
 */
const _w = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
function aimLive(bone: THREE.Bone, child: THREE.Object3D, dir: THREE.Vector3, space: THREE.Object3D, out: THREE.Quaternion) {
  bone.updateWorldMatrix(true, true);
  _w.copy(dir).transformDirection(space.matrixWorld);
  bone.getWorldPosition(_b);
  child.getWorldPosition(_c);
  _c.sub(_b).normalize();
  _q1.setFromUnitVectors(_c, _w).multiply(bone.getWorldQuaternion(_q2));
  const parentQ = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
  return out.copy(parentQ.invert().multiply(_q1));
}
const findBone = (root: THREE.Object3D, re: RegExp, not?: RegExp) => {
  let found: THREE.Bone | null = null;
  root.traverse((o) => {
    if (!found && (o as THREE.Bone).isBone && re.test(o.name) && !(not && not.test(o.name))) found = o as THREE.Bone;
  });
  return found as THREE.Bone | null;
};

/** Local rotation that makes `bone` point at `dir` (world space), measured toward `child`. */
function aim(bone: THREE.Bone, child: THREE.Object3D, dir: THREE.Vector3) {
  bone.updateWorldMatrix(true, true);
  const bp = bone.getWorldPosition(new THREE.Vector3());
  const cp = child.getWorldPosition(new THREE.Vector3());
  const cur = cp.sub(bp).normalize();
  const delta = new THREE.Quaternion().setFromUnitVectors(cur, dir.clone().normalize());
  const world = delta.multiply(bone.getWorldQuaternion(new THREE.Quaternion()));
  const parentQ = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
  return parentQ.invert().multiply(world);
}

function buildPose(upper: THREE.Bone, fore: THREE.Bone, hand: THREE.Object3D, du: THREE.Vector3, df: THREE.Vector3): Pose {
  const u0 = upper.quaternion.clone();
  const f0 = fore.quaternion.clone();
  upper.quaternion.copy(aim(upper, fore, du));
  const pose = { upper: upper.quaternion.clone(), fore: aim(fore, hand, df) };
  upper.quaternion.copy(u0);
  fore.quaternion.copy(f0);
  upper.updateWorldMatrix(false, true);
  return pose;
}

/**
 * Loads a sculpted avatar (public/models/avatar.glb), e.g. one exported from an
 * avatar creator, and drives it with the same scroll / pointer state as the
 * built-in character. Works with or without animation clips:
 *  - arms are lowered from a T/A-pose, wave and type procedurally
 *  - head bone follows the cursor
 *  - "idle" / "wave" / "typing" clips are used when present
 */
export default function GlbAvatar({
  url,
  state,
  enhance = true,
  glasses = true,
  children,
}: {
  url: string;
  state: React.RefObject<SceneState>;
  enhance?: boolean;
  glasses?: boolean;
  /** props that should move/turn with the character (e.g. the desk) */
  children?: React.ReactNode;
}) {
  const gltf = useGLTF(url);
  const root = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  // we drive the mixer ourselves (first thing each frame) so procedural poses can layer on top
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf]);
  const actions = useMemo(() => {
    const map: Record<string, THREE.AnimationAction> = {};
    for (const c of gltf.animations) map[c.name] = mixer.clipAction(c);
    return map;
  }, [gltf, mixer]);
  const names = useMemo(() => gltf.animations.map((c) => c.name), [gltf]);
  useEffect(() => () => {
    mixer.stopAllAction();
  }, [mixer]);
  const look = useRef({ x: 0, y: 0 });
  const waveT = useRef(0);
  const blink = useRef({ next: 2, t: -1 });
  const smileCycle = useRef({ next: 3, until: 0 });
  const current = useRef<string | null>(null);

  const setup = useMemo(() => {
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // full body if it has leg bones (T-posed arms make width a bad signal)
    let hasLegs = false;
    scene.traverse((o) => {
      if ((o as THREE.Bone).isBone && /(up_?leg|upper_?leg|thigh)/i.test(o.name)) hasLegs = true;
    });
    const isBust = !hasLegs && size.y / Math.max(size.x, 0.001) < 1.6;
    const sc = (isBust ? 2.3 : 3.9) / size.y;
    const offset = new THREE.Vector3(-center.x * sc, 2.35 - box.max.y * sc, -center.z * sc);

    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.frustumCulled = false;
    });
    // Detailed (textured) models already look right; the upgrades are only for flat low-poly ones.
    let textured = false;
    const smileMeshes: THREE.Mesh[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      if (mats.some((mt) => (mt as THREE.MeshStandardMaterial).map)) textured = true;
      const dict = m.morphTargetDictionary;
      // Ready Player Me: mouthSmile · Avaturn / ARKit: mouthSmileLeft/Right, eyeBlinkLeft/Right
      if (dict && Object.keys(dict).some((k) => /^(mouthSmile|eyeBlink)/.test(k))) smileMeshes.push(m);
      for (const mt of mats) {
        const sm = mt as THREE.MeshStandardMaterial;
        if (sm.map) sm.envMapIntensity = 1.1;
      }
    });
    const lowPoly = enhance && !textured;
    // game-pack characters often ship holding props; a portfolio avatar shouldn't
    scene.traverse((o) => {
      if (/knife|gun|sword|weapon|pistol|axe|shield|dagger/i.test(o.name)) o.visible = false;
    });
    if (lowPoly) {
      upgradeMaterials(scene);
      smoothShading(scene);
    }

    const head = findBone(scene, /head$/i) ?? findBone(scene, /head/i, /top|end/i) ?? findBone(scene, /neck/i);
    const arms: ArmRig[] = [];
    // Mixamo ("LeftArm"), Unreal ("upperarm_l") and generic ("Arm.L") naming
    for (const [side, sfx] of [["Left", "l"], ["Right", "r"]]) {
      const upper =
        findBone(scene, new RegExp(`${side}(Up)?Arm$`, "i"), /fore|lower/i) ?? findBone(scene, new RegExp(`upper_?arm[._]?${sfx}$`, "i"));
      const fore = findBone(scene, new RegExp(`${side}(Fore|Lower)Arm$`, "i")) ?? findBone(scene, new RegExp(`(lower_?arm|forearm)[._]?${sfx}$`, "i"));
      const hand =
        findBone(scene, new RegExp(`${side}Hand$`, "i")) ??
        findBone(scene, new RegExp(`(hand|wrist|palm)[._]?${sfx}$`, "i")) ??
        (fore?.children.find((c) => (c as THREE.Bone).isBone) as THREE.Bone | undefined) ??
        null;
      if (!upper || !fore || !hand) continue;
      const sx = Math.sign(upper.getWorldPosition(new THREE.Vector3()).x - center.x) || (side === "Left" ? 1 : -1);
      const s = sx as 1 | -1;
      arms.push({
        upper,
        fore,
        side: s,
        down: buildPose(upper, fore, hand, new THREE.Vector3(0.22 * s, -1, 0.05), new THREE.Vector3(0.12 * s, -1, 0.12)),
        type: buildPose(upper, fore, hand, new THREE.Vector3(0.3 * s, -0.75, 0.6), new THREE.Vector3(-0.25 * s, -0.15, 1)),
        waveA: buildPose(upper, fore, hand, new THREE.Vector3(0.7 * s, 0.55, 0.25), new THREE.Vector3(0.35 * s, 1, 0.2)),
        waveB: buildPose(upper, fore, hand, new THREE.Vector3(0.7 * s, 0.55, 0.25), new THREE.Vector3(-0.2 * s, 1, 0.2)),
        hand,
        finger: hand.children.find((c) => (c as THREE.Bone).isBone && /middle/i.test(c.name)) ?? hand.children.find((c) => (c as THREE.Bone).isBone) ?? null,
        bind: [upper.quaternion.clone(), fore.quaternion.clone(), hand.quaternion.clone()],
      });
    }
    const face: FaceRig | null = lowPoly && !scene.getObjectByName("FaceDetail") ? addFace(scene, head) : null;
    if (glasses && lowPoly && !scene.getObjectByName("Glasses")) addGlasses(scene, head);
    // spine bones for leaning toward the laptop
    const spine = ["Spine1", "Spine2"]
      .map((n) => findBone(scene, new RegExp(`${n}$`, "i")))
      .filter((b): b is THREE.Bone => !!b);
    const spineRest = spine.map((b) => b.quaternion.clone());

    // measure where the hands land in the desk pose so the table sits right under them
    let deskAnchor: [number, number, number] | null = null;
    if (arms.length === 2) {
      const saved = [...arms.flatMap((a) => [a.upper, a.fore, a.hand]), ...spine].map((b) => [b, b.quaternion.clone()] as const);
      leanSpine(spine, scene, 1);
      arms.forEach((a) => poseArm(a, scene, deskDirs(a.side), 1));
      scene.updateMatrixWorld(true);
      const mid = new THREE.Vector3();
      arms.forEach((a) => mid.add(scene.worldToLocal(a.hand.getWorldPosition(new THREE.Vector3()))));
      mid.multiplyScalar(0.5).multiplyScalar(sc).add(offset);
      deskAnchor = [mid.x, mid.y, mid.z];
      saved.forEach(([b, qq]) => b.quaternion.copy(qq));
      scene.updateMatrixWorld(true);
    }

    // shoulder line in the rest pose, used to keep the body facing the camera
    let shoulderAngle0 = 0;
    if (arms.length === 2) {
      const a = scene.worldToLocal(arms[0].upper.getWorldPosition(new THREE.Vector3()));
      const b = scene.worldToLocal(arms[1].upper.getWorldPosition(new THREE.Vector3()));
      shoulderAngle0 = Math.atan2(b.z - a.z, b.x - a.x);
    }

    return { scale: sc, offset, head, headRest: head ? head.quaternion.clone() : null, arms, face, smileMeshes, deskAnchor, shoulderAngle0, spine, spineRest };
  }, [gltf, enhance, glasses]);

  const clip = (re: RegExp) => names.find((n) => re.test(n));
  const idleName = clip(/(^|\|)idle$/i) ?? clip(/(^|\|)idle_neutral$/i) ?? clip(/idle|breath|stand/i);

  useEffect(() => {
    const start = idleName ?? null;
    if (start && actions[start]) {
      actions[start]!.reset().fadeIn(0.4).play();
      current.current = start;
    }
  }, [actions, idleName]);

  const play = (name: string | undefined) => {
    if (!name || current.current === name || !actions[name]) return;
    if (current.current) actions[current.current]?.fadeOut(0.35);
    actions[name]!.reset().fadeIn(0.35).play();
    current.current = name;
  };

  // does the playing clip actually animate this bone? (if not, we pose it ourselves)
  const animates = (bone: THREE.Object3D | null) => {
    if (!bone || !current.current) return false;
    const c = gltf.animations.find((a) => a.name === current.current);
    return !!c?.tracks.some((tr) => tr.name.startsWith(`${bone.name}.`) && tr.name.endsWith("quaternion"));
  };

  const v3a = useMemo(() => new THREE.Vector3(), []);
  const v3b = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => ({ a: new THREE.Quaternion(), b: new THREE.Quaternion(), look: new THREE.Quaternion(), e: new THREE.Euler() }), []);

  useFrame((s, delta) => {
    const st = state.current;
    if (!st || !rig.current) return;
    st.deskAnchor = setup.deskAnchor;
    const t = s.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    mixer.update(d);

    // the idle clip turns the body; counter-rotate so he faces the camera
    if (setup.arms.length === 2 && root.current) {
      const a = gltf.scene.worldToLocal(setup.arms[0].upper.getWorldPosition(v3a));
      const b = gltf.scene.worldToLocal(setup.arms[1].upper.getWorldPosition(v3b));
      let diff = Math.atan2(b.z - a.z, b.x - a.x) - setup.shoulderAngle0;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, diff, 3, d);
    }
    const waving = st.waveAt >= 0 && t - st.waveAt <= WAVE_LEN && st.desk < 0.2;
    waveT.current = THREE.MathUtils.damp(waveT.current, waving ? 1 : 0, 6, d);
    const w = waveT.current;

    const waveClip = clip(/wave|hello|greet/i);
    const typeClip = clip(/typ|sitting|work/i);
    if (st.desk > 0.5 && typeClip) play(typeClip);
    else if (waving && waveClip) play(waveClip);
    else if (idleName) play(idleName);

    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, st.offsetX, 4, d);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, st.desk * 1.7 + st.turn + pointer.x * 0.12 * (1 - st.desk), 4, d);
    // gentle float, plus a happy little bounce while greeting
    rig.current.position.y = Math.sin(t * 1.2) * 0.02;

    // arms: procedural pose on top of (or instead of) clips
    // lean toward the laptop at the desk
    setup.spine.forEach((b, i) => b.quaternion.copy(setup.spineRest[i]));
    if (st.desk > 0.01) leanSpine(setup.spine, gltf.scene, st.desk);

    for (const arm of setup.arms) {
      if (!animates(arm.upper)) {
        arm.upper.quaternion.copy(arm.down.upper);
        arm.fore.quaternion.copy(arm.down.fore);
        arm.hand.quaternion.copy(arm.bind[2]);
      }
      // desk: palms resting on the table in front of the laptop
      if (st.desk > 0.01) poseArm(arm, gltf.scene, deskDirs(arm.side), st.desk);
      // greeting: casual open-hands "hey" - arms eased out from the body, palms open, held briefly
      if (w > 0.001 && !waveClip) {
        const sd = arm.side;
        const sway = Math.sin(t * 1.6 + (sd > 0 ? 0 : 0.8)) * 0.04;
        poseArm(
          arm,
          gltf.scene,
          {
            upper: new THREE.Vector3(0.5 * sd, -0.82, 0.22),
            fore: new THREE.Vector3(0.5 * sd, -0.28 + sway, 0.8),
            hand: new THREE.Vector3(0.55 * sd, -0.05 + sway, 0.85),
          },
          w
        );
      }
    }

    // eyes look around and blink
    // built-in facial expressions (e.g. Ready Player Me): friendly smile, bigger while waving
    // blink timing shared by every face mesh
    const bk = blink.current;
    if (setup.smileMeshes.length && !setup.face) {
      if (bk.t < 0 && t > bk.next) bk.t = 0;
      if (bk.t >= 0) {
        bk.t += d;
        if (bk.t > 0.16) {
          bk.t = -1;
          bk.next = t + 2 + Math.random() * 3;
        }
      }
    }
    // smile now and then (and always while waving); otherwise a relaxed neutral face
    const sm = smileCycle.current;
    if (t > sm.next) {
      sm.until = t + 2.2 + Math.random() * 1.6;
      sm.next = sm.until + 5 + Math.random() * 5;
    }
    const smileTarget = Math.max(t < sm.until ? 1 : 0, w);
    const blinkAmt = bk.t >= 0 ? Math.sin(Math.min(1, bk.t / 0.16) * Math.PI) : 0;
    for (const m of setup.smileMeshes) {
      const dict = m.morphTargetDictionary!;
      const inf = m.morphTargetInfluences;
      if (!inf) continue;
      for (const key of ["mouthSmile", "mouthSmileLeft", "mouthSmileRight"]) {
        const i = dict[key];
        if (i !== undefined) inf[i] = THREE.MathUtils.damp(inf[i], smileTarget, 3.5, d);
      }
      for (const key of ["eyeBlinkLeft", "eyeBlinkRight"]) {
        const i = dict[key];
        if (i !== undefined) inf[i] = blinkAmt;
      }
    }

    if (setup.face) {
      const b = blink.current;
      if (b.t < 0 && t > b.next) b.t = 0;
      let close = 0;
      if (b.t >= 0) {
        b.t += d;
        close = Math.sin(Math.min(1, b.t / 0.16) * Math.PI);
        if (b.t > 0.16) {
          b.t = -1;
          b.next = t + 2 + Math.random() * 3;
        }
      }
      setup.face.update(look.current.x, look.current.y, close, w);
    }

    // head follows the cursor
    look.current.x = THREE.MathUtils.damp(look.current.x, pointer.x * 0.5 * (1 - st.desk), 5, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, pointer.y * 0.3 * (1 - st.desk) - st.desk * 0.35, 5, d);
    if (setup.head && setup.headRest) {
      // greeting: friendly head tilt + nod
      q.e.set(-look.current.y, look.current.x, w * 0.1);
      q.look.setFromEuler(q.e);
      if (animates(setup.head)) setup.head.quaternion.slerp(setup.headRest, 0.65).multiply(q.look);
      else setup.head.quaternion.copy(setup.headRest).multiply(q.look);
    } else {
      rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -look.current.y * 0.2, 4, d);
    }
  });

  return (
    <group ref={rig}>
      <group ref={root} scale={setup.scale} position={setup.offset}>
        <primitive object={gltf.scene} />
      </group>
      {children}
    </group>
  );
}
