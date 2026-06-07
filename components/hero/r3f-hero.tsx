"use client";
import { Canvas } from "@react-three/fiber";
import { FlowFieldPlane } from "./flow-field-plane";

export function R3FHero() {
  // `canvas-fade-in` (globals.css) eases the gradient→shader swap in on mount
  // instead of hard-cutting — a one-shot CSS animation (no state/effect). Only
  // full-motion users reach R3FHero (hero.tsx gates reduced motion to the static
  // fallback), and the keyframe self-disables under prefers-reduced-motion.
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1], near: 0, far: 2, zoom: 1 }}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      flat
      className="canvas-fade-in"
      style={{ position: "absolute", inset: 0 }}
    >
      <FlowFieldPlane />
    </Canvas>
  );
}
