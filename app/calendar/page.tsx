"use client";

import CalendarView from "@/components/calendar/CalendarView";
import { GlassCard } from "@/components/ui/glass-card";

export default function CalendarPage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CALENDAR
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Scheduled tasks, cron jobs, and events. All timelines converge here.
        </p>
      </GlassCard>
      <CalendarView />
    </div>
  );
}
