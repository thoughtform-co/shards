"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneMode = "idle" | "generating" | "playing";

export type OverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type JukeboxSceneProps = {
  mode: SceneMode;
  analyserNode: AnalyserNode | null;
  className?: string;
  onOverlayRectsReady?: (rects: {
    display: OverlayRect;
    upload: OverlayRect;
  }) => void;
};

const PRIMARY = 0x3c3cff;
const META = 0xff79b5;
const CABINET_COLOR = 0x6a53a0;
const CHROME_COLOR = 0xe8e8f0;
const DARK_RECESS = 0x040210;
const BULB_COUNT = 12;

function createCabinetShape(): THREE.Shape {
  const w = 0.8;
  const s = new THREE.Shape();
  s.moveTo(-w, -1.2);
  s.lineTo(-w, 0.85);
  s.quadraticCurveTo(-w, 1.42, 0, 1.48);
  s.quadraticCurveTo(w, 1.42, w, 0.85);
  s.lineTo(w, -1.2);
  s.lineTo(-w, -1.2);
  return s;
}

function makeChromeTrim(
  w: number,
  h: number,
  d: number,
): THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: CHROME_COLOR,
    metalness: 0.9,
    roughness: 0.15,
  });
  return new THREE.Mesh(geo, mat);
}

function projectBox(
  camera: THREE.PerspectiveCamera,
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  viewW: number,
  viewH: number,
): OverlayRect {
  const toScreen = (x: number, y: number, z: number) => {
    const v = new THREE.Vector3(x, y, z).project(camera);
    return {
      sx: (v.x * 0.5 + 0.5) * viewW,
      sy: (1 - (v.y * 0.5 + 0.5)) * viewH,
    };
  };
  const tl = toScreen(cx - w / 2, cy + h / 2, cz);
  const br = toScreen(cx + w / 2, cy - h / 2, cz);
  return {
    top: tl.sy,
    left: tl.sx,
    width: br.sx - tl.sx,
    height: br.sy - tl.sy,
  };
}

export function JukeboxScene({
  mode,
  analyserNode,
  className,
  onOverlayRectsReady,
}: JukeboxSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mode, analyserNode });
  stateRef.current = { mode, analyserNode };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f0a18, 5.4, 9.2);
    const BASE_FOV = 34;
    const BASE_Z = 5.2;
    const JUKEBOX_HALF_HEIGHT = 1.5;
    const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 100);
    camera.position.set(0, 0.05, BASE_Z);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x120d1f, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.35;
    el.appendChild(renderer.domElement);

    // ── Lighting: moody bar atmosphere ──
    scene.add(new THREE.HemisphereLight(0x6655cc, 0x21172f, 1.0));
    scene.add(new THREE.AmbientLight(0x6a5396, 1.55));

    const keyLight = new THREE.PointLight(0xffeedd, 2.35, 18);
    keyLight.position.set(2.5, 3, 4.5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x6a86ff, 1.45, 18);
    fillLight.position.set(-2.5, 0.5, 3.5);
    scene.add(fillLight);

    const frontFill = new THREE.PointLight(0xf2ebff, 2.65, 18);
    frontFill.position.set(0, 0.6, 4.2);
    scene.add(frontFill);

    const rimLight = new THREE.PointLight(0xff79b5, 1.15, 18);
    rimLight.position.set(0, -1.5, -3);
    scene.add(rimLight);

    const topSpot = new THREE.SpotLight(0xfff1de, 2.1, 14, Math.PI / 5, 0.6);
    topSpot.position.set(0, 4, 3);
    topSpot.target.position.set(0, 0, 0);
    scene.add(topSpot);
    scene.add(topSpot.target);

    const edgeLight = new THREE.PointLight(0x9f7dff, 1.0, 16);
    edgeLight.position.set(0, 1.8, -2.5);
    scene.add(edgeLight);

    const floorBounce = new THREE.PointLight(0x65458d, 0.85, 12);
    floorBounce.position.set(0, -1.4, 1.5);
    scene.add(floorBounce);

    const leftBarLight = new THREE.PointLight(0x7050ff, 0.9, 12);
    leftBarLight.position.set(-2.4, 0.2, 0.8);
    scene.add(leftBarLight);

    const rightBarLight = new THREE.PointLight(0xff79b5, 0.8, 12);
    rightBarLight.position.set(2.4, 0.2, 0.8);
    scene.add(rightBarLight);

    // ── Cabinet body ──
    const cabinetGeo = new THREE.ExtrudeGeometry(createCabinetShape(), {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
    });
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: CABINET_COLOR,
      roughness: 0.42,
      metalness: 0.15,
      emissive: 0x32264d,
      emissiveIntensity: 1.15,
    });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.z = -0.25;
    scene.add(cabinet);

    const frontFaceGeo = new THREE.ShapeGeometry(createCabinetShape());
    const frontFaceMat = new THREE.MeshBasicMaterial({
      color: 0x7a63b3,
      transparent: true,
      opacity: 0.82,
    });
    const frontFace = new THREE.Mesh(frontFaceGeo, frontFaceMat);
    frontFace.position.set(0, 0, 0.272);
    frontFace.scale.set(0.965, 0.965, 1);
    scene.add(frontFace);

    const cabinetEdgeGeo = new THREE.EdgesGeometry(cabinetGeo);
    const cabinetEdgeMat = new THREE.LineBasicMaterial({
      color: 0x8d7cff,
      transparent: true,
      opacity: 0.9,
    });
    const cabinetEdges = new THREE.LineSegments(cabinetEdgeGeo, cabinetEdgeMat);
    cabinetEdges.position.copy(cabinet.position);
    cabinetEdges.position.z += 0.012;
    scene.add(cabinetEdges);

    // ── Base ──
    const baseGeo = new THREE.BoxGeometry(1.72, 0.16, 0.56);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x181128,
      roughness: 0.42,
      metalness: 0.15,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -1.28;
    scene.add(base);

    const baseEdgeGeo = new THREE.EdgesGeometry(baseGeo);
    const baseEdgeMat = new THREE.LineBasicMaterial({
      color: 0xff79b5,
      transparent: true,
      opacity: 0.65,
    });
    const baseEdges = new THREE.LineSegments(baseEdgeGeo, baseEdgeMat);
    baseEdges.position.copy(base.position);
    baseEdges.position.z += 0.012;
    scene.add(baseEdges);

    // ── Display bezel + recess ──
    const displayBezelGeo = new THREE.BoxGeometry(1.28, 0.9, 0.035);
    const displayBezelMat = new THREE.MeshBasicMaterial({
      color: 0x3b305c,
      transparent: true,
      opacity: 0.88,
    });
    const displayBezel = new THREE.Mesh(displayBezelGeo, displayBezelMat);
    displayBezel.position.set(0, 0.38, 0.282);
    scene.add(displayBezel);

    const displayGeo = new THREE.BoxGeometry(1.2, 0.82, 0.06);
    const recessMat = new THREE.MeshStandardMaterial({
      color: DARK_RECESS,
      roughness: 0.9,
      metalness: 0,
    });
    const display = new THREE.Mesh(displayGeo, recessMat);
    display.position.set(0, 0.38, 0.27);
    scene.add(display);

    const displayGlowGeo = new THREE.PlaneGeometry(1.16, 0.78);
    const displayGlowMat = new THREE.MeshBasicMaterial({
      color: 0x201944,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const displayGlow = new THREE.Mesh(displayGlowGeo, displayGlowMat);
    displayGlow.position.set(0, 0.38, 0.289);
    scene.add(displayGlow);

    // ── Upload bezel + recess ──
    const uploadBezelGeo = new THREE.BoxGeometry(1.28, 0.7, 0.035);
    const uploadBezelMat = new THREE.MeshBasicMaterial({
      color: 0x352a56,
      transparent: true,
      opacity: 0.84,
    });
    const uploadBezel = new THREE.Mesh(uploadBezelGeo, uploadBezelMat);
    uploadBezel.position.set(0, -0.62, 0.282);
    scene.add(uploadBezel);

    const uploadGeo = new THREE.BoxGeometry(1.2, 0.62, 0.06);
    const upload = new THREE.Mesh(uploadGeo, recessMat);
    upload.position.set(0, -0.62, 0.27);
    scene.add(upload);

    const uploadGlowGeo = new THREE.PlaneGeometry(1.16, 0.58);
    const uploadGlowMat = new THREE.MeshBasicMaterial({
      color: 0x141a38,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const uploadGlow = new THREE.Mesh(uploadGlowGeo, uploadGlowMat);
    uploadGlow.position.set(0, -0.62, 0.289);
    scene.add(uploadGlow);

    // ── Chrome trims ──
    const trims: THREE.Mesh[] = [];
    const trimPositions: [number, number, number, number, number][] = [
      [1.4, 0.03, 0.04, 0, 0.92],
      [1.4, 0.03, 0.04, 0, -0.97],
      [0.03, 2.15, 0.04, -0.72, -0.1],
      [0.03, 2.15, 0.04, 0.72, -0.1],
    ];
    for (const [tw, th, td, tx, ty] of trimPositions) {
      const trim = makeChromeTrim(tw, th, td);
      trim.position.set(tx, ty, 0.27);
      scene.add(trim);
      trims.push(trim);
    }

    const sideGlowGeo = new THREE.PlaneGeometry(0.025, 2.18);
    const leftGlowMat = new THREE.MeshBasicMaterial({
      color: PRIMARY,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const rightGlowMat = new THREE.MeshBasicMaterial({
      color: META,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const leftGlow = new THREE.Mesh(sideGlowGeo, leftGlowMat);
    leftGlow.position.set(-0.77, -0.08, 0.305);
    scene.add(leftGlow);
    const rightGlow = new THREE.Mesh(sideGlowGeo, rightGlowMat);
    rightGlow.position.set(0.77, -0.08, 0.305);
    scene.add(rightGlow);

    // ── Display glass ──
    const glassGeo = new THREE.PlaneGeometry(1.22, 0.84);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a40,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0.38, 0.30);
    scene.add(glass);

    // ── Bulbs ──
    const bulbGeo = new THREE.SphereGeometry(0.045, 12, 8);
    const bulbMeshes: THREE.Mesh<
      THREE.SphereGeometry,
      THREE.MeshStandardMaterial
    >[] = [];

    for (let i = 0; i < BULB_COUNT; i++) {
      const t = i / (BULB_COUNT - 1);
      const angle = Math.PI * 0.15 + t * Math.PI * 0.7;
      const rx = 0.72;
      const ry = 0.5;
      const x = Math.cos(angle) * rx;
      const y = 1.0 + Math.sin(angle) * ry;
      const isBlue = i % 2 === 0;

      const mat = new THREE.MeshStandardMaterial({
        color: isBlue ? PRIMARY : META,
        emissive: isBlue ? PRIMARY : META,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(bulbGeo, mat);
      mesh.position.set(x, y, 0.28);
      scene.add(mesh);
      bulbMeshes.push(mesh);
    }

    // ── ZooMedia logo on marquee ──
    const logoLoader = new THREE.TextureLoader();
    const marqueeGlowGeo = new THREE.PlaneGeometry(0.72, 0.18);
    const marqueeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x6f58c7,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const marqueeGlow = new THREE.Mesh(marqueeGlowGeo, marqueeGlowMat);
    marqueeGlow.position.set(0, 1.32, 0.285);
    scene.add(marqueeGlow);

    logoLoader.load("/experiments/image-to-spotify/zoomedia-logo.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const aspect = tex.image.width / tex.image.height;
      const logoH = 0.18;
      const logoW = logoH * aspect;
      const logoGeo = new THREE.PlaneGeometry(logoW, logoH);
      const logoMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      });
      const logoMesh = new THREE.Mesh(logoGeo, logoMat);
      logoMesh.position.set(0, 1.34, 0.29);
      scene.add(logoMesh);
    });

    // ── ZOOBOX title beneath logo ──
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const ctx = labelCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = "bold 72px Fredoka, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "8px";
    ctx.fillText("ZOOBOX", 256, 64);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelW = 0.52;
    const labelH = labelW * (128 / 512);
    const labelGeo = new THREE.PlaneGeometry(labelW, labelH);
    const labelMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      depthWrite: false,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(0, 1.2, 0.29);
    scene.add(labelMesh);

    // ── Halo rings (playback visualizer) ──
    const haloGeo = new THREE.RingGeometry(0.62, 0.66, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: META,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0.38, 0.31);
    scene.add(halo);

    const halo2Geo = new THREE.RingGeometry(0.68, 0.71, 48);
    const halo2Mat = new THREE.MeshBasicMaterial({
      color: PRIMARY,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
    halo2.position.set(0, 0.38, 0.305);
    scene.add(halo2);

    // ── Floor ──
    const floorGeo = new THREE.PlaneGeometry(8, 4);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e0a18,
      roughness: 0.7,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.36;
    scene.add(floor);

    // ── Back glow cards: soft, wide, and non-rectangular in feel ──
    const ambientLeftGlowGeo = new THREE.CircleGeometry(1.8, 48);
    const ambientLeftGlowMat = new THREE.MeshBasicMaterial({
      color: 0x4030b0,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    const leftGlowCard = new THREE.Mesh(ambientLeftGlowGeo, ambientLeftGlowMat);
    leftGlowCard.position.set(-2.2, 0.2, -1.4);
    leftGlowCard.scale.set(1.2, 1.8, 1);
    scene.add(leftGlowCard);

    const ambientRightGlowGeo = new THREE.CircleGeometry(1.8, 48);
    const ambientRightGlowMat = new THREE.MeshBasicMaterial({
      color: 0x8e4db6,
      transparent: true,
      opacity: 0.065,
      depthWrite: false,
    });
    const rightGlowCard = new THREE.Mesh(ambientRightGlowGeo, ambientRightGlowMat);
    rightGlowCard.position.set(2.2, 0.1, -1.35);
    rightGlowCard.scale.set(1.35, 1.95, 1);
    scene.add(rightGlowCard);

    // ── Ambient particles ──
    const particleCount = 40;
    const pPositions = new Float32Array(particleCount * 3);
    const pPhases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 4;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2 + 1;
      pPhases[i] = Math.random() * Math.PI * 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x8888cc,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Spark particles (generating accent layer) ──
    const sparkCount = 60;
    const spPositions = new Float32Array(sparkCount * 3);
    const spVelocities = new Float32Array(sparkCount * 3);
    const spLifetimes = new Float32Array(sparkCount);
    function resetSpark(i: number) {
      spPositions[i * 3] = (Math.random() - 0.5) * 1.2;
      spPositions[i * 3 + 1] = -0.4 + Math.random() * 1.8;
      spPositions[i * 3 + 2] = 0.3 + Math.random() * 0.4;
      spVelocities[i * 3] = (Math.random() - 0.5) * 0.025;
      spVelocities[i * 3 + 1] = 0.008 + Math.random() * 0.018;
      spVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
      spLifetimes[i] = Math.random();
    }
    for (let i = 0; i < sparkCount; i++) resetSpark(i);
    const spGeo = new THREE.BufferGeometry();
    spGeo.setAttribute("position", new THREE.BufferAttribute(spPositions, 3));
    const spMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffaadd,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(spGeo, spMat);
    scene.add(sparks);

    // ── Resize + overlay projection ──
    function resize() {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;

      const fovRad = (BASE_FOV * Math.PI) / 180;
      const neededZ =
        JUKEBOX_HALF_HEIGHT / Math.tan(fovRad / 2) + 0.25;
      camera.position.z = Math.max(BASE_Z, neededZ);

      camera.updateProjectionMatrix();

      if (onOverlayRectsReady) {
        const displayRect = projectBox(camera, 0, 0.38, 0.27, 1.2, 0.82, w, h);
        const uploadRect = projectBox(camera, 0, -0.62, 0.27, 1.2, 0.62, w, h);
        onOverlayRectsReady({ display: displayRect, upload: uploadRect });
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ── Animate ──
    const clock = new THREE.Clock();
    const dataArray = new Uint8Array(128);
    let frameId = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { mode: m, analyserNode: an } = stateRef.current;

      let energy = 0;
      let lowEnergy = 0;
      let highEnergy = 0;
      if (an && m === "playing") {
        an.getByteFrequencyData(dataArray);
        let sum = 0;
        let lo = 0;
        let hi = 0;
        const mid = Math.floor(dataArray.length / 2);
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i];
          sum += v;
          if (i < mid) lo += v;
          else hi += v;
        }
        energy = sum / (dataArray.length * 255);
        lowEnergy = lo / (mid * 255);
        highEnergy = hi / (mid * 255);
      }

      // ── Bulb animation ──
      for (let i = 0; i < bulbMeshes.length; i++) {
        const bulb = bulbMeshes[i];
        const mat = bulb.material;
        if (m === "generating") {
          const chase = Math.sin(t * 6 - i * 0.5) * 0.5 + 0.5;
          const flicker = Math.sin(t * 12 + i * 2.1) * 0.15;
          mat.emissiveIntensity = 0.4 + chase * 2.0 + flicker;
          bulb.scale.setScalar(1 + chase * 0.3);
        } else if (m === "playing") {
          const band = i < bulbMeshes.length / 2 ? lowEnergy : highEnergy;
          mat.emissiveIntensity = 0.15 + band * 2;
          bulb.scale.setScalar(1);
        } else {
          mat.emissiveIntensity =
            0.15 + 0.1 * Math.sin(t * 0.8 + i * 0.5);
          bulb.scale.setScalar(1);
        }
      }

      // ── Halo animation ──
      if (m === "playing") {
        haloMat.opacity = 0.15 + lowEnergy * 0.6;
        halo.scale.setScalar(1 + lowEnergy * 0.3);
        halo2Mat.opacity = 0.1 + highEnergy * 0.5;
        halo2.scale.setScalar(1 + highEnergy * 0.2);
        halo.rotation.z = t * 0.3;
        halo2.rotation.z = -t * 0.2;
      } else if (m === "generating") {
        haloMat.opacity = 0.2 + 0.25 * Math.sin(t * 4);
        halo.scale.setScalar(1.0 + 0.25 * Math.sin(t * 3));
        halo.rotation.z = t * 1.2;
        halo2Mat.opacity = 0.15 + 0.2 * Math.sin(t * 3.5);
        halo2.scale.setScalar(1.0 + 0.2 * Math.sin(t * 2.5));
        halo2.rotation.z = -t * 0.8;
      } else {
        haloMat.opacity = 0;
        halo2Mat.opacity = 0;
      }

      // ── Glass shimmer ──
      glassMat.opacity = 0.08 + 0.04 * Math.sin(t * 1.2);

      // ── Particle drift (amplified during generating) ──
      const isGen = m === "generating";
      const driftSpeed = isGen ? 0.004 : 0.001;
      const jitterAmp = isGen ? 0.0015 : 0.0003;
      const pArr = (pGeo.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pArr[i * 3 + 1] += driftSpeed;
        pArr[i * 3] += Math.sin(t * (isGen ? 1.5 : 0.3) + pPhases[i]) * jitterAmp;
        if (isGen) pArr[i * 3 + 2] += Math.cos(t * 2 + pPhases[i]) * 0.0004;
        if (pArr[i * 3 + 1] > 2) pArr[i * 3 + 1] = -1.5;
      }
      (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      pMat.size = isGen ? 0.04 : 0.02;
      pMat.opacity = isGen ? 0.7 : m === "playing" ? 0.4 : 0.2;
      pMat.color.setHex(isGen ? 0xbbaaff : 0x8888cc);

      // ── Spark particles (visible only during generating) ──
      const spArr = (spGeo.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      if (isGen) {
        spMat.opacity = 0.5 + 0.3 * Math.sin(t * 4);
        for (let i = 0; i < sparkCount; i++) {
          spArr[i * 3] += spVelocities[i * 3];
          spArr[i * 3 + 1] += spVelocities[i * 3 + 1];
          spArr[i * 3 + 2] += spVelocities[i * 3 + 2];
          spLifetimes[i] += 0.012;
          if (spLifetimes[i] > 1) resetSpark(i);
        }
        spMat.size = 0.03 + 0.02 * Math.sin(t * 6);
        spMat.color.setHex(t % 0.8 > 0.4 ? 0xffaadd : 0xaaccff);
      } else {
        spMat.opacity = Math.max(0, spMat.opacity - 0.02);
      }
      (spGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // ── Full light rig pulse during generation ──
      if (isGen) {
        const pulse = Math.sin(t * 2.5);
        const fastPulse = Math.sin(t * 5);
        keyLight.intensity = 2.0 + 0.8 * pulse;
        fillLight.intensity = 1.8 + 0.6 * fastPulse;
        fillLight.color.setHex(t % 1 > 0.5 ? PRIMARY : META);
        frontFill.intensity = 3.2 + 1.0 * pulse;
        rimLight.intensity = 1.8 + 0.8 * fastPulse;
        topSpot.intensity = 2.8 + 1.2 * pulse;
        floorBounce.intensity = 1.2 + 0.6 * fastPulse;
        leftBarLight.intensity = 1.4 + 0.8 * Math.sin(t * 3);
        rightBarLight.intensity = 1.3 + 0.8 * Math.sin(t * 3 + 1.5);
        edgeLight.intensity = 1.6 + 0.6 * pulse;
        leftGlowMat.opacity = 0.42 + 0.3 * Math.sin(t * 3.5);
        rightGlowMat.opacity = 0.42 + 0.3 * Math.sin(t * 3.5 + Math.PI);
        marqueeGlowMat.opacity = 0.2 + 0.25 * Math.abs(fastPulse);
      } else {
        keyLight.intensity = 2.35;
        fillLight.intensity = 1.45;
        fillLight.color.setHex(0x6a86ff);
        frontFill.intensity = 2.65;
        rimLight.intensity = 1.15;
        topSpot.intensity = 2.1;
        floorBounce.intensity = 0.85;
        leftBarLight.intensity = 0.9;
        rightBarLight.intensity = 0.8;
        edgeLight.intensity = 1.0;
        leftGlowMat.opacity = 0.42;
        rightGlowMat.opacity = 0.42;
        marqueeGlowMat.opacity = 0.18;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.dispose();
      cabinetGeo.dispose();
      cabinetMat.dispose();
      frontFaceGeo.dispose();
      frontFaceMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      displayBezelGeo.dispose();
      displayBezelMat.dispose();
      displayGeo.dispose();
      displayGlowGeo.dispose();
      displayGlowMat.dispose();
      uploadBezelGeo.dispose();
      uploadBezelMat.dispose();
      uploadGeo.dispose();
      uploadGlowGeo.dispose();
      uploadGlowMat.dispose();
      recessMat.dispose();
      bulbGeo.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      halo2Geo.dispose();
      halo2Mat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      ambientLeftGlowGeo.dispose();
      ambientLeftGlowMat.dispose();
      ambientRightGlowGeo.dispose();
      ambientRightGlowMat.dispose();
      cabinetEdgeGeo.dispose();
      cabinetEdgeMat.dispose();
      baseEdgeGeo.dispose();
      baseEdgeMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      spGeo.dispose();
      spMat.dispose();
      sideGlowGeo.dispose();
      leftGlowMat.dispose();
      rightGlowMat.dispose();
      marqueeGlowGeo.dispose();
      marqueeGlowMat.dispose();
      for (const trim of trims) {
        trim.geometry.dispose();
        (trim.material as THREE.Material).dispose();
      }
      for (const b of bulbMeshes) (b.material as THREE.Material).dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
