"use client";

import KanbanBoard from "@/components/tasks/KanbanBoard";
import { GlassCard } from "@/components/ui/glass-card";

export default function TasksPage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in-up">
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TASKS BOARD
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Drag cards between columns to update status.
        </p>
      </GlassCard>
      <KanbanBoard />
    </div>
  );
}
