"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type VisualizerMode = "idle" | "generating" | "playing";

type JukeboxVisualizerProps = {
  mode: VisualizerMode;
  analyserNode: AnalyserNode | null;
  className?: string;
};

const ORBIT_COUNT = 200;
const SPARK_COUNT = 80;
const PRIMARY = 0x3c3cff;
const META = 0xff79b5;
const ACCENT = 0x7c5cff;

export function JukeboxVisualizer({
  mode,
  analyserNode,
  className,
}: JukeboxVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ mode, analyserNode });
  stateRef.current = { mode, analyserNode };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Orbit particles (main ring system) ──
    const oPositions = new Float32Array(ORBIT_COUNT * 3);
    const oColors = new Float32Array(ORBIT_COUNT * 3);
    const oPhases = new Float32Array(ORBIT_COUNT);
    const oRadii = new Float32Array(ORBIT_COUNT);
    const oSpeeds = new Float32Array(ORBIT_COUNT);

    for (let i = 0; i < ORBIT_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.0 + Math.random() * 1.8;
      oPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      oPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      oPositions[i * 3 + 2] = r * Math.cos(phi);

      const c = new THREE.Color(
        i % 3 === 0 ? PRIMARY : i % 3 === 1 ? META : ACCENT,
      );
      oColors[i * 3] = c.r;
      oColors[i * 3 + 1] = c.g;
      oColors[i * 3 + 2] = c.b;

      oPhases[i] = Math.random() * Math.PI * 2;
      oRadii[i] = r;
      oSpeeds[i] = 0.5 + Math.random() * 1.0;
    }

    const oGeo = new THREE.BufferGeometry();
    oGeo.setAttribute("position", new THREE.BufferAttribute(oPositions, 3));
    oGeo.setAttribute("color", new THREE.BufferAttribute(oColors, 3));
    const oMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const orbits = new THREE.Points(oGeo, oMat);
    scene.add(orbits);

    // ── Spark particles (accent streaks for playing/generating) ──
    const sPositions = new Float32Array(SPARK_COUNT * 3);
    const sColors = new Float32Array(SPARK_COUNT * 3);
    const sPhases = new Float32Array(SPARK_COUNT);
    const sLifetimes = new Float32Array(SPARK_COUNT);
    const sVelocities = new Float32Array(SPARK_COUNT * 3);

    function resetSpark(i: number) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.5;
      sPositions[i * 3] = Math.cos(angle) * r;
      sPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      sPositions[i * 3 + 2] = Math.sin(angle) * r;

      const speed = 0.015 + Math.random() * 0.03;
      sVelocities[i * 3] = Math.cos(angle) * speed;
      sVelocities[i * 3 + 1] = (Math.random() - 0.3) * speed * 1.5;
      sVelocities[i * 3 + 2] = Math.sin(angle) * speed;

      sLifetimes[i] = Math.random() * 0.3;

      const c = new THREE.Color(Math.random() > 0.5 ? META : ACCENT);
      sColors[i * 3] = c.r;
      sColors[i * 3 + 1] = c.g;
      sColors[i * 3 + 2] = c.b;
    }

    for (let i = 0; i < SPARK_COUNT; i++) {
      resetSpark(i);
      sPhases[i] = Math.random() * Math.PI * 2;
    }

    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPositions, 3));
    sGeo.setAttribute("color", new THREE.BufferAttribute(sColors, 3));
    const sMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sGeo, sMat);
    scene.add(sparks);

    // ── Glow ring (pulses with synthetic beat) ──
    const ringGeo = new THREE.RingGeometry(1.5, 1.56, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: META,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    const ring2Geo = new THREE.RingGeometry(1.8, 1.84, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: PRIMARY,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    scene.add(ring2);

    function resize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let frameId = 0;
    const clock = new THREE.Clock();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { mode: m, analyserNode: an } = stateRef.current;

      const isPlaying = m === "playing";
      const isGen = m === "generating";
      const isActive = isPlaying || isGen;

      let beat: number;
      let halfBeat: number;

      if (an && isPlaying) {
        const dataArray = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(dataArray);
        let lo = 0;
        let hi = 0;
        const mid = Math.floor(dataArray.length / 2);
        for (let b = 0; b < dataArray.length; b++) {
          if (b < mid) lo += dataArray[b]; else hi += dataArray[b];
        }
        beat = lo / (mid * 255);
        halfBeat = hi / (mid * 255);
      } else {
        beat = Math.pow(Math.sin(t * Math.PI * 2) * 0.5 + 0.5, 3);
        halfBeat = Math.pow(Math.sin(t * Math.PI * 4) * 0.5 + 0.5, 4);
      }

      // ── Orbit particles ──
      const oArr = (oGeo.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;

      for (let i = 0; i < ORBIT_COUNT; i++) {
        const phase = oPhases[i];
        const baseR = oRadii[i];
        const spd = oSpeeds[i];

        let speed: number;
        let displacement: number;

        if (isGen) {
          speed = spd * 3.0;
          displacement = 0.5 * Math.sin(t * 4 + phase);
        } else if (isPlaying) {
          speed = spd * (1.2 + beat * 1.8);
          displacement = beat * 0.8 * Math.sin(t * 2.5 + phase)
            + halfBeat * 0.3 * Math.cos(t * 5 + phase);
        } else {
          speed = spd * 0.3;
          displacement = 0.08 * Math.sin(t * 0.6 + phase);
        }

        const r = baseR + displacement;
        const theta = phase + t * speed * 0.3;
        const phi = Math.acos(Math.sin(phase * 0.5 + t * speed * 0.1) * 0.8);

        oArr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        oArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        oArr[i * 3 + 2] = r * Math.cos(phi);
      }
      (oGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      if (isGen) {
        oMat.opacity = 0.6 + 0.3 * Math.sin(t * 4);
        oMat.size = 0.07 + 0.03 * Math.sin(t * 3);
      } else if (isPlaying) {
        oMat.opacity = 0.5 + beat * 0.4;
        oMat.size = 0.055 + beat * 0.04 + halfBeat * 0.02;
      } else {
        oMat.opacity = 0.3;
        oMat.size = 0.04;
      }

      // ── Sparks (active during playing and generating) ──
      const sArr = (sGeo.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;

      if (isActive) {
        const targetOpacity = isGen
          ? 0.5 + 0.3 * Math.sin(t * 5)
          : 0.35 + beat * 0.45;
        sMat.opacity += (targetOpacity - sMat.opacity) * 0.1;
        sMat.size = isGen
          ? 0.04 + 0.02 * Math.sin(t * 6)
          : 0.03 + beat * 0.03;

        for (let i = 0; i < SPARK_COUNT; i++) {
          const speedMul = isPlaying ? 1 + beat * 2 : 1.5;
          sArr[i * 3] += sVelocities[i * 3] * speedMul;
          sArr[i * 3 + 1] += sVelocities[i * 3 + 1] * speedMul;
          sArr[i * 3 + 2] += sVelocities[i * 3 + 2] * speedMul;
          sLifetimes[i] += 0.012 * speedMul;
          if (sLifetimes[i] > 1) resetSpark(i);
        }
      } else {
        sMat.opacity = Math.max(0, sMat.opacity - 0.015);
      }
      (sGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // ── Glow rings ──
      if (isPlaying) {
        ringMat.opacity = 0.08 + beat * 0.2;
        ring.scale.setScalar(1 + beat * 0.15);
        ring.rotation.z = t * 0.3;
        ring2Mat.opacity = 0.06 + halfBeat * 0.15;
        ring2.scale.setScalar(1 + halfBeat * 0.1);
        ring2.rotation.z = -t * 0.2;
      } else if (isGen) {
        ringMat.opacity = 0.1 + 0.15 * Math.sin(t * 3);
        ring.scale.setScalar(1 + 0.12 * Math.sin(t * 2));
        ring.rotation.z = t * 0.6;
        ring2Mat.opacity = 0.08 + 0.1 * Math.sin(t * 2.5);
        ring2.rotation.z = -t * 0.4;
      } else {
        ringMat.opacity = Math.max(0, ringMat.opacity - 0.01);
        ring2Mat.opacity = Math.max(0, ring2Mat.opacity - 0.01);
      }

      // ── Global rotation ──
      const rotSpeed = isPlaying ? 0.15 + beat * 0.08 : isGen ? 0.2 : 0.05;
      orbits.rotation.y = t * rotSpeed;
      orbits.rotation.x = Math.sin(t * 0.05) * 0.15;
      sparks.rotation.y = -t * rotSpeed * 0.6;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      renderer.dispose();
      oGeo.dispose();
      oMat.dispose();
      sGeo.dispose();
      sMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
