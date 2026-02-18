"use client";

import TeamGrid from "@/components/team/TeamGrid";
import { GlassCard } from "@/components/ui/glass-card";

export default function TeamPage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TEAM STRUCTURE
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Agent roster. All personnel files. Real-time status.
        </p>
      </GlassCard>
      <TeamGrid />
    </div>
  );
}
