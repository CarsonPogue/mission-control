"use client";

import PipelineBoard from "@/components/content/PipelineBoard";
import { GlassCard } from "@/components/ui/glass-card";

export default function ContentPage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CONTENT PIPELINE
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Idea to published. Drag cards through stages.
        </p>
      </GlassCard>
      <PipelineBoard />
    </div>
  );
}
