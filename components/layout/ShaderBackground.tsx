"use client";

import { FallingPattern } from "@/components/ui/falling-pattern";

export default function ShaderBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <FallingPattern
        color="#9a9a9f"
        backgroundColor="#ffffff"
        duration={150}
        blurIntensity="0.6em"
        density={0.7}
        className="h-full w-full"
      />
    </div>
  );
}
