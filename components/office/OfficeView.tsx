"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import WorkstationTile from "./WorkstationTile";
import AgentProfile from "@/components/team/AgentProfile";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/glass-card";

export default function OfficeView() {
  const agents = useQuery(api.agents.list);
  const seedAgents = useMutation(api.agents.seed);
  const [selectedAgent, setSelectedAgent] = useState<Doc<"agents"> | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (agents && agents.length === 0) {
      seedAgents();
    }
  }, [agents, seedAgents]);

  if (agents === undefined) return <LoadingState label="Loading office..." />;
  if (agents.length === 0) return <EmptyState title="No agents" description="Seeding agents..." />;

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalCount = agents.length;
  const efficiency = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Efficiency meter */}
      <GlassCard glowEffect={false} className="px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)", boxShadow: "0 0 6px var(--accent-primary)" }} />
            Team Efficiency
          </span>
          <span
            className="text-sm font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: efficiency >= 50 ? "var(--accent-success)" : "var(--accent-warning)",
              textShadow: `0 0 10px ${efficiency >= 50 ? "rgba(45,212,160,0.3)" : "rgba(245,158,11,0.3)"}`,
            }}
          >
            {efficiency}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${efficiency}%`,
              background: efficiency >= 50
                ? "linear-gradient(90deg, var(--accent-success), var(--accent-primary))"
                : "linear-gradient(90deg, var(--accent-warning), var(--accent-danger))",
              transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: `0 0 12px ${efficiency >= 50 ? "var(--accent-success)" : "var(--accent-warning)"}40`,
            }}
          />
        </div>
        <div className="mt-2 text-[10px]" style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}>
          {activeCount} of {totalCount} agents active
        </div>
      </GlassCard>

      {/* Office grid */}
      <GlassCard glowEffect={false}
        className="relative p-4 md:p-6"
        style={{
          backgroundImage: `
            linear-gradient(var(--glass-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10 stagger-children">
          {agents.map((agent) => (
            <WorkstationTile
              key={agent._id}
              agent={agent}
              onClick={() => {
                setSelectedAgent(agent);
                setProfileOpen(true);
              }}
            />
          ))}
        </div>
      </GlassCard>

      {/* Activity ticker */}
      <GlassCard glowEffect={false} className="mt-6 px-4 py-3 overflow-hidden" style={{ borderLeft: "2px solid var(--accent-primary)" }}>
        <div
          className="text-[10px] tracking-[0.2em] uppercase mb-2 flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-status-pulse" style={{ background: "var(--accent-success)", boxShadow: "0 0 6px var(--accent-success)" }} />
          Activity Feed
        </div>
        <div className="flex flex-col gap-1.5">
          {agents
            .filter((a) => a.status === "active" && a.currentTask)
            .map((a) => (
              <div key={a._id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full animate-status-pulse" style={{ background: "var(--accent-success)" }} />
                <span className="text-[11px]" style={{ fontFamily: "var(--font-code)", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent-primary)" }}>{a.name}</span>
                  {" "}— {a.currentTask}
                </span>
              </div>
            ))}
          {agents.filter((a) => a.status === "active" && a.currentTask).length === 0 && (
            <div className="text-[11px]" style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}>
              No active tasks. Agents on standby.
            </div>
          )}
        </div>
      </GlassCard>

      <AgentProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
}
