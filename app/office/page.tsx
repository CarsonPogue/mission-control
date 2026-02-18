"use client";

import OfficeView from "@/components/office/OfficeView";
import { GlassCard } from "@/components/ui/glass-card";

export default function OfficePage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          DIGITAL OFFICE
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Live view of all agent workstations. Watch the system work.
        </p>
      </GlassCard>
      <OfficeView />
    </div>
  );
}
