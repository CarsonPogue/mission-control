"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Doc } from "../../convex/_generated/dataModel";
import Badge from "@/components/ui/Badge";
import { AGENT_STATUS_COLORS, AGENT_ROLE_COLORS } from "@/lib/constants";

export default function AgentCard({
  agent,
  onClick,
}: {
  agent: Doc<"agents">;
  onClick: () => void;
}) {
  const statusColor = AGENT_STATUS_COLORS[agent.status];
  const roleColor = AGENT_ROLE_COLORS[agent.role] ?? "#007AFF";

  return (
    <GlassCard
      onClick={onClick}
      className="p-4 overflow-hidden"
      style={{ borderTop: `2px solid ${roleColor}` }}
    >
      {/* Scanline effect for active agents */}
      {agent.status === "active" && (
        <div className="absolute inset-0 pointer-events-none scanline-overlay z-0" />
      )}

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold relative"
          style={{
            background: `${roleColor}15`,
            color: roleColor,
            fontFamily: "var(--font-display)",
            border: `1px solid ${roleColor}30`,
            boxShadow: agent.status === "active" ? `0 0 15px ${roleColor}20` : "none",
          }}
        >
          {agent.name.charAt(0)}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${agent.status === "active" ? "animate-status-pulse" : ""}`}
            style={{
              background: statusColor,
              borderColor: "var(--bg-surface)",
              boxShadow: agent.status === "active" ? `0 0 8px ${statusColor}` : "none",
            }}
          />
        </div>
        <div>
          <h3
            className="text-sm font-bold tracking-wide"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {agent.name}
          </h3>
          <div
            className="text-[10px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-code)", color: roleColor }}
          >
            {agent.role}
          </div>
        </div>
      </div>

      {/* Type badge */}
      <div className="mb-3 flex items-center gap-2">
        <Badge
          label={agent.type === "primary" ? "Primary" : "Sub-Agent"}
          color={agent.type === "primary" ? "#4f8ef7" : "#64748b"}
        />
        <Badge label={agent.status} color={statusColor} pulse={agent.status === "active"} />
      </div>

      {/* Current task */}
      {agent.currentTask && (
        <div
          className="text-[11px] px-2.5 py-2 rounded-[var(--radius-sm)] mb-3"
          style={{
            background: "var(--glass-bg-hover)",
            border: "1px solid var(--glass-border)",
            fontFamily: "var(--font-code)",
            color: "var(--text-secondary)",
          }}
        >
          Working on: {agent.currentTask}
        </div>
      )}

      {/* Responsibilities */}
      <div className="flex flex-wrap gap-1">
        {agent.responsibilities.slice(0, 3).map((r) => (
          <span
            key={r}
            className="text-[9px] px-1.5 py-0.5 rounded tracking-wider uppercase"
            style={{
              background: "var(--glass-bg)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-code)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {r}
          </span>
        ))}
        {agent.responsibilities.length > 3 && (
          <span className="text-[9px] px-1.5 py-0.5" style={{ color: "var(--text-muted)" }}>
            +{agent.responsibilities.length - 3}
          </span>
        )}
      </div>
    </GlassCard>
  );
}
