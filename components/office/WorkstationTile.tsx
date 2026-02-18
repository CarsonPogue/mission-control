"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Doc } from "../../convex/_generated/dataModel";
import { AGENT_STATUS_COLORS, AGENT_ROLE_COLORS } from "@/lib/constants";

export default function WorkstationTile({
  agent,
  onClick,
}: {
  agent: Doc<"agents">;
  onClick: () => void;
}) {
  const statusColor = AGENT_STATUS_COLORS[agent.status];
  const roleColor = AGENT_ROLE_COLORS[agent.role] ?? "#007AFF";
  const isActive = agent.status === "active";
  const isIdle = agent.status === "idle";
  const isOffline = agent.status === "offline";

  return (
    <GlassCard
      onClick={onClick}
      className={`p-4 ${isActive ? "scanline-overlay" : ""}`}
      style={{
        borderColor: isActive ? `${roleColor}40` : undefined,
        opacity: isOffline ? 0.5 : 1,
      }}
    >
      {/* Monitor */}
      <div
        className={`relative rounded-lg mb-3 flex items-center justify-center overflow-hidden ${isActive ? "crt-glow" : ""}`}
        style={{
          background: isActive
            ? `linear-gradient(135deg, var(--bg-elevated), ${roleColor}08)`
            : "var(--bg-base)",
          border: `1px solid ${isActive ? roleColor + "30" : "var(--glass-border)"}`,
          height: "80px",
        }}
      >
        {isActive && (
          <>
            <div className="absolute inset-2 overflow-hidden">
              <div
                className="text-[8px] leading-[1.4] opacity-60"
                style={{ fontFamily: "var(--font-code)", color: roleColor }}
              >
                {`> ${agent.currentTask || agent.role}`}
                <br />
                {`> status: ${agent.status}`}
                <br />
                {`> processing...`}
                <span className="animate-status-pulse">_</span>
              </div>
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${roleColor}05 2px, ${roleColor}05 4px)`,
              }}
            />
          </>
        )}
        {isIdle && (
          <div
            className="text-[9px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
          >
            Standby
          </div>
        )}
        {isOffline && (
          <div
            className="text-[9px] tracking-wider uppercase"
            style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
          >
            Offline
          </div>
        )}
      </div>

      {/* Monitor stand */}
      <div className="flex justify-center mb-2">
        <div className="w-6 h-2 rounded-b" style={{ background: "var(--glass-border)" }} />
      </div>

      {/* Desk surface */}
      <div
        className="rounded-[var(--radius-sm)] px-3 py-2"
        style={{
          background: "var(--glass-bg-hover)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${isOffline ? "opacity-40" : ""}`}
            style={{
              background: `${roleColor}15`,
              color: roleColor,
              fontFamily: "var(--font-display)",
              border: `1px solid ${roleColor}25`,
            }}
          >
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[11px] font-bold truncate"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {agent.name}
            </div>
            <div
              className="text-[9px] truncate"
              style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
            >
              {agent.role}
            </div>
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? "animate-status-pulse" : ""}`}
            style={{
              background: statusColor,
              boxShadow: isActive ? `0 0 8px ${statusColor}` : "none",
            }}
          />
        </div>
      </div>

      {/* Current task */}
      {isActive && agent.currentTask && (
        <div
          className="mt-2 text-[9px] px-2 py-1.5 rounded truncate"
          style={{
            background: `${roleColor}08`,
            color: roleColor,
            fontFamily: "var(--font-code)",
            border: `1px solid ${roleColor}15`,
          }}
        >
          {agent.currentTask}
        </div>
      )}
    </GlassCard>
  );
}
