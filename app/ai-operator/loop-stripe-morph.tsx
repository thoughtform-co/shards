"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * Loop → Stripe morph — particle field that pingpongs between the Loop
 * brand mark (a purple donut) and the Stripe brand mark (a slanted
 * parallelogram). Targets are derived from `public/Loop.svg` and
 * `public/Stripe.svg`, so the silhouettes match the actual assets.
 *
 * Lightweight: no shaders, one Points mesh, two precomputed target
 * arrays, CPU lerp per frame. Each particle is paired by polar angle
 * from the center, so the morph reads as the ring deflating and the
 * hole filling up from the inside rather than as random shuffling.
 *
 * Respects prefers-reduced-motion: paints a static mid-morph state and
 * skips the RAF loop. Uses an IntersectionObserver to pause when the
 * section is offscreen so it doesn't burn cycles below the fold.
 */

const COUNT = 1800;

/* Brand colors lifted directly from the SVGs in /public. */
const LOOP_COLOR = new THREE.Color("#4E26B8");
const STRIPE_COLOR = new THREE.Color("#533AFD");

const CYCLE_MS = 8000;

/* Loop ring — outer / inner radii from Loop.svg (135 viewBox, outer
 * radius 67.5, inner radius derived from the 29.1422 px stroke). */
const LOOP_R_OUT = 1.0;
const LOOP_R_IN = (67.5 - 29.1422) / 67.5;

/* Stripe parallelogram — vertices from Stripe.svg (133 × 137 viewBox)
 * recentered on (66.5, 68.09), Y-flipped for WebGL, then normalized
 * by 67.5 so the right edge matches the Loop ring's outer radius.
 *   V0 (-66.5, -68.09)  V1 (66.5, -39.47)  V2 (66.5, 68.09)  V3 (-66.5, 39.47)
 * Half-edges, with V0..V3 = ±e1 ± e2:
 *   e1 = (V1 - V0) / 2 = ( 0.985,  0.212)   half the slanted bottom-edge
 *   e2 = (V2 - V1) / 2 = ( 0.000,  0.797)   half the vertical right-edge
 * Any interior point is s * e1 + t * e2 with s, t in [-1, 1], which
 * gives true uniform sampling without dealing with the slant explicitly. */
const STRIPE_E1X = 66.5 / 67.5;
const STRIPE_E1Y = (-39.475 - -68.09) / 2 / 67.5;
const STRIPE_E2X = 0;
const STRIPE_E2Y = (68.09 - -39.475) / 2 / 67.5;

function buildSpriteTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.78)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Build both target clouds in one pass, paired by angle.
 *
 * Strategy: sample each particle's Stripe target uniformly inside the
 * parallelogram (s, t in [-1, 1]² is exactly uniform), then derive its
 * Loop target as a point on the ring at the same polar angle from the
 * origin with a randomly chosen ring radius. Pairing particles by angle
 * means the morph reads as the ring deflating into the parallelogram
 * (and the hole filling in from the inside) rather than as a chaotic
 * shuffle. Both shapes end up uniformly area-filled. */
function buildShapeTargets(): {
  loop: Float32Array;
  stripe: Float32Array;
} {
  const loop = new Float32Array(COUNT * 3);
  const stripe = new Float32Array(COUNT * 3);

  const ringSpan = LOOP_R_OUT * LOOP_R_OUT - LOOP_R_IN * LOOP_R_IN;

  for (let i = 0; i < COUNT; i++) {
    const ix = i * 3;

    const s = Math.random() * 2 - 1;
    const t = Math.random() * 2 - 1;
    const sx = s * STRIPE_E1X + t * STRIPE_E2X;
    const sy = s * STRIPE_E1Y + t * STRIPE_E2Y;

    stripe[ix] = sx;
    stripe[ix + 1] = sy;
    stripe[ix + 2] = (Math.random() - 0.5) * 0.04;

    const angle = Math.atan2(sy, sx);
    const r = Math.sqrt(LOOP_R_IN * LOOP_R_IN + ringSpan * Math.random());
    loop[ix] = Math.cos(angle) * r;
    loop[ix + 1] = Math.sin(angle) * r;
    loop[ix + 2] = (Math.random() - 0.5) * 0.04;
  }

  return { loop, stripe };
}

/* Phase shape: hold Loop → morph → hold Stripe → morph back. Returns p
 * in [0, 1] where 0 is full Loop and 1 is full Stripe. */
function phaseProgress(time: number): number {
  const phase = ((time % CYCLE_MS) / CYCLE_MS);
  if (phase < 0.18) return 0;
  if (phase < 0.5) {
    const k = (phase - 0.18) / 0.32;
    return easeInOut(k);
  }
  if (phase < 0.68) return 1;
  const k = (phase - 0.68) / 0.32;
  return 1 - easeInOut(k);
}

function easeInOut(x: number): number {
  return x < 0.5
    ? 2 * x * x
    : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function LoopStripeMorph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const { loop: loopTargets, stripe: stripeTargets } = buildShapeTargets();

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    positions.set(loopTargets);
    for (let i = 0; i < COUNT; i++) {
      colors[i * 3] = LOOP_COLOR.r;
      colors[i * 3 + 1] = LOOP_COLOR.g;
      colors[i * 3 + 2] = LOOP_COLOR.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const sprite = buildSpriteTexture();
    const mat = new THREE.PointsMaterial({
      size: 0.044,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    function applyProgress(p: number) {
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const col = colAttr.array as Float32Array;

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        pos[ix] = loopTargets[ix] * (1 - p) + stripeTargets[ix] * p;
        pos[ix + 1] = loopTargets[ix + 1] * (1 - p) + stripeTargets[ix + 1] * p;
        pos[ix + 2] = loopTargets[ix + 2] * (1 - p) + stripeTargets[ix + 2] * p;

        col[ix] = LOOP_COLOR.r * (1 - p) + STRIPE_COLOR.r * p;
        col[ix + 1] = LOOP_COLOR.g * (1 - p) + STRIPE_COLOR.g * p;
        col[ix + 2] = LOOP_COLOR.b * (1 - p) + STRIPE_COLOR.b * p;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    const node = el;

    function resize() {
      const w = node.clientWidth;
      const h = node.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(node);

    let frameId = 0;
    let visible = true;
    let lastT = performance.now();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    function frame(now: number) {
      frameId = requestAnimationFrame(frame);
      if (!visible) {
        lastT = now;
        return;
      }
      const dt = now - lastT;
      lastT = now;

      const elapsed = (frame as unknown as { _t?: number })._t ?? 0;
      const next = elapsed + dt;
      (frame as unknown as { _t?: number })._t = next;

      const p = phaseProgress(next);
      applyProgress(p);

      const breath = Math.sin(now * 0.0006) * 0.012;
      points.rotation.z = breath;

      renderer.render(scene, camera);
    }

    if (reduce) {
      applyProgress(0.5);
      renderer.render(scene, camera);
    } else {
      frameId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(frameId);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      if (renderer.domElement.parentElement === node) {
        node.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="aiop-morph-canvas"
      role="img"
      aria-label="A purple Loop ring morphing into a slanted Stripe parallelogram."
    />
  );
}
