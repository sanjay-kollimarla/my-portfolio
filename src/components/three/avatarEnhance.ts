import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Upgrades a low-poly character: real-world materials per surface, optionally
 */

type Look = Partial<THREE.MeshPhysicalMaterialParameters>;

// Tuned for Quaternius-style material names; anything else gets a sensible default.
const LOOKS: { match: RegExp; look: Look }[] = [
  {
    match: /suit|jacket|coat|shirt_?dark|pants|legs/i,
    look: { color: "#232838", roughness: 0.68, metalness: 0, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color("#7c8bc4") },
  },
  { match: /^black$|shoe|boot/i, look: { color: "#0d0d10", roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 } },
  { match: /white|shirt/i, look: { color: "#eef0f6", roughness: 0.7, metalness: 0, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color("#dbe4ff") } },
  {
    match: /tie/i,
    look: { color: "#5b21b6", roughness: 0.32, metalness: 0, sheen: 1, sheenRoughness: 0.3, sheenColor: new THREE.Color("#c4b5fd"), clearcoat: 0.3 },
  },
  {
    match: /skin|body|face/i,
    look: { color: "#c98a63", roughness: 0.5, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.6, sheen: 0.7, sheenRoughness: 0.4, sheenColor: new THREE.Color("#ffb59a") },
  },
  { match: /hair/i, look: { color: "#17100d", roughness: 0.42, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.35, sheen: 0.5, sheenColor: new THREE.Color("#6b4a3a") } },
  { match: /brow|beard|lash/i, look: { color: "#140d0a", roughness: 0.8, metalness: 0 } },
  { match: /eye/i, look: { color: "#120806", roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02 } },
];

export function upgradeMaterials(root: THREE.Object3D) {
  const cache = new Map<THREE.Material, THREE.MeshPhysicalMaterial>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const convert = (m: THREE.Material) => {
      const src = m as THREE.MeshStandardMaterial;
      if (cache.has(m)) return cache.get(m)!;
      const look = LOOKS.find((l) => l.match.test(src.name))?.look ?? { metalness: Math.min(src.metalness ?? 0, 0.1), roughness: 0.6, sheen: 0.4 };
      const phys = new THREE.MeshPhysicalMaterial({
        name: src.name,
        color: src.color?.clone(),
        map: src.map ?? null,
        normalMap: src.normalMap ?? null,
        vertexColors: false,
        ...look,
      } as THREE.MeshPhysicalMaterialParameters);
      phys.envMapIntensity = 1.15;
      cache.set(m, phys);
      return phys;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(convert) : convert(mesh.material);
  });
}

/** Turns faceted (flat) shading into smooth shading by welding duplicate vertices. */
export function smoothShading(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    let g = mesh.geometry.clone();
    g.deleteAttribute("normal");
    // UVs and vertex colours split vertices at seams; drop them for welding (materials are flat colours)
    if (!(mesh.material as THREE.MeshStandardMaterial).map) {
      g.deleteAttribute("uv");
      g.deleteAttribute("color");
    }
    g = mergeVertices(g, 1e-4);
    g.computeVertexNormals();
    mesh.geometry = g;
  });
}

/** Builds glasses sized to the eye meshes and parents them to the head bone. */
export function addGlasses(root: THREE.Object3D, head: THREE.Object3D | null) {
  if (!head) return;
  root.updateMatrixWorld(true);
  let eye: THREE.Mesh | null = null;
  let headMesh: THREE.Mesh | null = null;
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const name = (Array.isArray(m.material) ? m.material[0] : m.material)?.name ?? "";
    if (!eye && /^eyes?$/i.test(name)) eye = m;
    if (!headMesh && /skin/i.test(name) && /head/i.test(m.name + (m.parent?.name ?? ""))) headMesh = m;
  });
  if (!eye) return;
  const eyeMesh = eye as THREE.SkinnedMesh;
  // build in the model's upright load space (y up, z forward)
  eyeMesh.geometry.computeBoundingBox();
  const eb = eyeMesh.geometry.boundingBox!.clone().applyMatrix4(eyeMesh.matrixWorld);
  const es = eb.getSize(new THREE.Vector3());
  const ec = eb.getCenter(new THREE.Vector3());

  let headDepth = es.x * 1.6;
  if (headMesh) {
    const hm = headMesh as THREE.Mesh;
    hm.geometry.computeBoundingBox();
    const hb = hm.geometry.boundingBox!.clone().applyMatrix4(hm.matrixWorld);
    headDepth = hb.getSize(new THREE.Vector3()).z;
  }

  const eyeH = Math.max(es.y, es.x * 0.12);
  const lensR = eyeH * 1.25;
  const offsetX = es.x / 2 - eyeH * 0.45;
  const front = eb.max.z + eyeH * 0.55;

  const frameMat = new THREE.MeshPhysicalMaterial({ color: "#111014", roughness: 0.2, clearcoat: 1, metalness: 0.3 });
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.02,
    transparent: true,
    opacity: 0.14,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.5,
    side: THREE.DoubleSide,
    depthWrite: false, // never hide the eyes behind the lenses
  });
  const tube = lensR * 0.11;
  const glasses = new THREE.Group();
  glasses.name = "Glasses";
  for (const s of [-1, 1]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(lensR, tube, 12, 48), frameMat);
    rim.position.set(ec.x + offsetX * s, ec.y, front);
    rim.scale.set(1.12, 0.92, 1);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(lensR, 40), lensMat);
    lens.renderOrder = 5;
    lens.position.copy(rim.position);
    lens.scale.copy(rim.scale);
    // temples running back to the ears
    const templeLen = headDepth * 0.55;
    const temple = new THREE.Mesh(new THREE.BoxGeometry(tube * 1.4, tube * 1.6, templeLen), frameMat);
    temple.position.set(ec.x + (offsetX + lensR * 1.12) * s, ec.y + lensR * 0.35, front - templeLen / 2);
    temple.rotation.y = 0.12 * s;
    glasses.add(rim, lens, temple);
  }
  const bridgeW = Math.max(0.0001, offsetX * 2 - lensR * 2.24);
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(bridgeW / 2, tube * 0.9, 8, 16, Math.PI), frameMat);
  bridge.position.set(ec.x, ec.y + lensR * 0.25, front);
  glasses.add(bridge);

  // bind space -> head-bone space (exactly how the eye vertices are skinned), so the
  // glasses follow every head movement regardless of the current animation pose
  const idx = eyeMesh.isSkinnedMesh ? eyeMesh.skeleton.bones.indexOf(head as THREE.Bone) : -1;
  if (idx >= 0) {
    // load space -> mesh local -> bind -> head-bone local
    const toBone = eyeMesh.skeleton.boneInverses[idx]
      .clone()
      .multiply(eyeMesh.bindMatrix)
      .multiply(eyeMesh.matrixWorld.clone().invert());
    toBone.decompose(glasses.position, glasses.quaternion, glasses.scale);
    head.add(glasses);
  } else {
    head.attach(glasses);
  }
}

function findFaceMeshes(root: THREE.Object3D) {
  let eye: THREE.Mesh | null = null;
  let headSkin: THREE.Mesh | null = null;
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const name = (Array.isArray(m.material) ? m.material[0] : m.material)?.name ?? "";
    if (!eye && /^eyes?$/i.test(name)) eye = m;
    if (!headSkin && /skin/i.test(name) && /head/i.test(m.name + (m.parent?.name ?? ""))) headSkin = m;
  });
  return { eye: eye as THREE.Mesh | null, headSkin: headSkin as THREE.Mesh | null };
}

/** Converts a group built in load space into the head bone's local space and parents it there. */
function parentToHead(group: THREE.Object3D, head: THREE.Object3D, ref: THREE.Mesh) {
  const sk = ref as THREE.SkinnedMesh;
  const idx = sk.isSkinnedMesh ? sk.skeleton.bones.indexOf(head as THREE.Bone) : -1;
  if (idx >= 0) {
    const toBone = sk.skeleton.boneInverses[idx].clone().multiply(sk.bindMatrix).multiply(sk.matrixWorld.clone().invert());
    toBone.decompose(group.position, group.quaternion, group.scale);
    head.add(group);
  } else {
    head.attach(group);
  }
}

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Almond-shaped eye: white with soft lid shadow and a dark upper lash line. */
function eyeTexture(closed: boolean) {
  return canvasTex(256, 160, (ctx) => {
    const almond = (pad: number) => {
      ctx.beginPath();
      ctx.moveTo(14 + pad, 86);
      ctx.bezierCurveTo(60, 14 + pad, 196, 14 + pad, 242 - pad, 80);
      ctx.bezierCurveTo(196, 148 - pad, 60, 148 - pad, 14 + pad, 86);
      ctx.closePath();
    };
    if (closed) {
      ctx.strokeStyle = "#140c0a";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(20, 84);
      ctx.quadraticCurveTo(128, 120, 236, 80);
      ctx.stroke();
      return;
    }
    almond(0);
    const g = ctx.createLinearGradient(0, 20, 0, 150);
    g.addColorStop(0, "#d9d2cc");
    g.addColorStop(0.35, "#fbfaf7");
    g.addColorStop(1, "#f1ece8");
    ctx.fillStyle = g;
    ctx.fill();
    // upper lash line
    ctx.strokeStyle = "#120a08";
    ctx.lineCap = "round";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(16, 86);
    ctx.bezierCurveTo(60, 16, 196, 16, 244, 76);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(60,30,20,0.6)";
    almond(2);
    ctx.stroke();
  });
}

function irisTex() {
  return canvasTex(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 46);
    g.addColorStop(0, "#0d0604");
    g.addColorStop(0.32, "#1a0d06");
    g.addColorStop(0.36, "#4f2a12");
    g.addColorStop(0.8, "#8a5428");
    g.addColorStop(1, "#2a1408");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(64, 64, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(78, 50, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(52, 78, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function mouthTex() {
  return canvasTex(256, 128, (ctx) => {
    ctx.beginPath();
    ctx.moveTo(26, 40);
    ctx.quadraticCurveTo(128, 64, 230, 40);
    ctx.quadraticCurveTo(128, 118, 26, 40);
    ctx.closePath();
    ctx.fillStyle = "#3b1210";
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "#fbfbf8";
    ctx.beginPath();
    ctx.moveTo(30, 40);
    ctx.quadraticCurveTo(128, 66, 226, 40);
    ctx.lineTo(226, 62);
    ctx.quadraticCurveTo(128, 80, 30, 62);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(120,50,40,0.85)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(26, 40);
    ctx.quadraticCurveTo(128, 118, 230, 40);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(14, 34);
    ctx.quadraticCurveTo(22, 40, 24, 48);
    ctx.moveTo(242, 34);
    ctx.quadraticCurveTo(234, 40, 232, 48);
    ctx.stroke();
  });
}

export type FaceRig = { update: (lookX: number, lookY: number, blink: number, smile: number) => void };

/**
 * Paints facial detail onto the head as decals that hug the surface (eyes with
 * moving irises, blinking lids, a smile) plus a trimmed beard in vertex colours.
 */
export function addFace(root: THREE.Object3D, head: THREE.Object3D | null, opts: { beard?: boolean } = {}): FaceRig | null {
  if (!head || typeof document === "undefined") return null;
  root.updateMatrixWorld(true);
  const { eye, headSkin } = findFaceMeshes(root);
  if (!eye || !headSkin) return null;

  eye.geometry.computeBoundingBox();
  const eb = eye.geometry.boundingBox!.clone().applyMatrix4(eye.matrixWorld);
  const es = eb.getSize(new THREE.Vector3());
  const ec = eb.getCenter(new THREE.Vector3());
  headSkin.geometry.computeBoundingBox();
  const hb = headSkin.geometry.boundingBox!.clone().applyMatrix4(headSkin.matrixWorld);
  const chin = Math.max(hb.min.y, ec.y - (hb.max.y - ec.y) * 1.05);

  // Raycast an unskinned proxy: skinned raycasts return animated positions, but decals,
  // the eye bounds and the head-bone conversion all work in raw mesh (bind) space.
  const proxy = new THREE.Mesh(headSkin.geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  proxy.matrixAutoUpdate = false;
  proxy.matrix.copy(headSkin.matrixWorld);
  proxy.matrixWorld.copy(headSkin.matrixWorld);
  const ray = new THREE.Raycaster();
  /**
   * A small grid that hugs the face: each vertex is projected onto the skin.
   * Where the head mesh has a hole (eye sockets), depth is filled from the rim,
   * so the patch spans the hole instead of disappearing into it.
   */
  const surfacePatch = (cx: number, cy: number, w: number, h: number, lift: number, n = 14) => {
    const zs: (number | null)[] = [];
    for (let j = 0; j <= n; j++)
      for (let i = 0; i <= n; i++) {
        const x = cx + (i / n - 0.5) * w;
        const y = cy + (j / n - 0.5) * h;
        ray.set(new THREE.Vector3(x, y, hb.max.z + 1), new THREE.Vector3(0, 0, -1));
        const hit = ray.intersectObject(proxy, false)[0];
        zs.push(hit ? hit.point.z : null);
      }
    const found = zs.filter((z): z is number => z !== null);
    const fill = found.length ? Math.max(...found) : hb.max.z * 0.9;
    const geo = new THREE.PlaneGeometry(w, h, n, n);
    const pos = geo.getAttribute("position");
    for (let k = 0; k < pos.count; k++) {
      // PlaneGeometry rows run top -> bottom; our samples run bottom -> top
      const i = k % (n + 1);
      const j = n - Math.floor(k / (n + 1));
      const z = zs[j * (n + 1) + i] ?? fill;
      pos.setXYZ(k, cx + pos.getX(k), cy + pos.getY(k), z + lift);
    }
    geo.computeVertexNormals();
    return geo;
  };

  const decalMat = (map: THREE.Texture, order: number) =>
    new THREE.MeshPhysicalMaterial({
      map,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4 - order,
      roughness: 0.25,
      clearcoat: 0.6,
    });

  const face = new THREE.Group();
  face.name = "FaceDetail";

  const eyeW = es.x * 0.42;
  const eyeH = eyeW * 0.62;
  const off = es.x / 2 - eyeW * 0.42;
  const openTex = eyeTexture(false);
  const closedTex = eyeTexture(true);
  const iTex = irisTex();
  const eyeMats: THREE.MeshPhysicalMaterial[] = [];
  const irisMats: THREE.MeshPhysicalMaterial[] = [];

  for (const s of [-1, 1]) {
    const eyeMat = decalMat(openTex, 0);
    const cx = ec.x + off * s;
    const eyeDecal = new THREE.Mesh(surfacePatch(cx, ec.y, eyeW, eyeH, eyeW * 0.02), eyeMat);
    const it = iTex.clone();
    it.needsUpdate = true;
    it.wrapS = it.wrapT = THREE.ClampToEdgeWrapping;
    const irisMat = decalMat(it, 1);
    const irisDecal = new THREE.Mesh(surfacePatch(cx, ec.y, eyeH * 0.95, eyeH * 0.95, eyeW * 0.035, 8), irisMat);
    // draw order: skin -> eye white -> iris (transparent decals skip depth writes)
    eyeDecal.renderOrder = 2;
    irisDecal.renderOrder = 3;
    face.add(eyeDecal, irisDecal);
    eyeMats.push(eyeMat);
    irisMats.push(irisMat);
  }
  eye.visible = false;

  const mouthY = ec.y - (ec.y - chin) * 0.6;
  const mouthW = es.x * 0.5;
  const mouthMat = decalMat(mouthTex(), 0);
  const mouth = new THREE.Mesh(
    surfacePatch(ec.x, mouthY, mouthW, mouthW * 0.5, mouthW * 0.02),
    mouthMat
  );
  mouth.renderOrder = 2;
  face.add(mouth);

  parentToHead(face, head, eye);

  if (opts.beard !== false) paintBeard(headSkin, ec, es, hb, chin);

  return {
    update(lookX, lookY, blink) {
      const closed = blink > 0.5;
      for (const mat of eyeMats) {
        const want = closed ? closedTex : openTex;
        if (mat.map !== want) {
          mat.map = want;
          mat.needsUpdate = true;
        }
      }
      for (const mat of irisMats) {
        mat.visible = !closed;
        // slide the iris inside the eye
        mat.map!.offset.set(-lookX * 0.22, -lookY * 0.12);
      }
    },
  };
}

function paintBeard(headSkin: THREE.Mesh, ec: THREE.Vector3, es: THREE.Vector3, hb: THREE.Box3, chin: number) {
  const geo = headSkin.geometry;
  const pos = geo.getAttribute("position");
  const mat = (headSkin.material as THREE.MeshPhysicalMaterial).clone();
  const skin = mat.color.clone();
  const beardCol = new THREE.Color("#1f1410");
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const noseBottom = ec.y - (ec.y - chin) * 0.38;
  const hc = hb.getCenter(new THREE.Vector3());
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(headSkin.matrixWorld);
    const below = THREE.MathUtils.smoothstep(noseBottom - v.y, -es.x * 0.02, es.x * 0.12);
    const front = THREE.MathUtils.smoothstep(v.z - hc.z, -es.x * 0.15, es.x * 0.1);
    const aboveNeck = THREE.MathUtils.smoothstep(v.y - (chin - es.x * 0.05), 0, es.x * 0.15);
    const k = below * front * aboveNeck * 0.95;
    const c = skin.clone().lerp(beardCol, k);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  mat.vertexColors = true;
  mat.color.set("#ffffff");
  headSkin.material = mat;
}

