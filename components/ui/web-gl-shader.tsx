"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

type Uniforms = {
  resolution: { value: [number, number] };
  time: { value: number };
};

const VERTEX_SHADER = `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Soft, slowly drifting bands of gold light on a transparent canvas, so the
 * effect composites cleanly onto the charcoal page. Brand palette only — no
 * RGB. Intensity stays low and fades toward the bottom so it reads as ambient
 * light behind the Hero rather than a foreground graphic.
 */
const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float t = time * 0.12;
    float light = 0.0;
    light += 0.016 / abs(p.y + 0.45 + sin(p.x * 1.2 + t) * 0.16);
    light += 0.012 / abs(p.y + 0.10 + sin(p.x * 0.8 - t * 1.3) * 0.22);
    light += 0.009 / abs(p.y - 0.32 + sin(p.x * 1.7 + t * 0.7) * 0.14);

    // Concentrate near the top; fade to nothing lower down.
    float falloff = smoothstep(0.0, 0.85, 1.0 - uv.y);
    float a = clamp(light, 0.0, 1.0) * falloff * 0.8;

    vec3 gold = vec3(0.831, 0.686, 0.216);
    // Premultiplied alpha (the renderer uses premultipliedAlpha by default).
    gl_FragColor = vec4(gold * a, a);
  }
`;

/** Fills its positioned parent. Decorative only (aria-hidden). */
export function WebGLShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms: Uniforms = {
      resolution: { value: [1, 1] },
      time: { value: 0 },
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        // Two triangles covering clip space.
        new Float32Array([
          -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0,
        ]),
        3,
      ),
    );
    const material = new THREE.RawShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render() {
      renderer.render(scene, camera);
    }

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      const pr = renderer.getPixelRatio();
      uniforms.resolution.value = [w * pr, h * pr];
      render();
    }

    let animationId: number | null = null;
    function animate() {
      uniforms.time.value += 0.01;
      render();
      animationId = requestAnimationFrame(animate);
    }
    function start() {
      if (animationId === null && !reduceMotion) animate();
    }
    function stop() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause while the Hero is scrolled out of view (perf + battery).
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-full w-full", className)}
    />
  );
}
