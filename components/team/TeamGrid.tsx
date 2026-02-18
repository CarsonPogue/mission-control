"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import AgentCard from "./AgentCard";
import AgentProfile from "./AgentProfile";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";
import { GlassCard } from "@/components/ui/glass-card";

export default function TeamGrid() {
  const agents = useQuery(api.agents.list);
  const seedAgents = useMutation(api.agents.seed);
  const [selectedAgent, setSelectedAgent] = useState<Doc<"agents"> | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (agents && agents.length === 0) {
      seedAgents();
    }
  }, [agents, seedAgents]);

  if (agents === undefined) return <LoadingState label="Loading agents..." />;

  if (agents.length === 0) {
    return (
      <EmptyState
        title="No agents found"
        description="Seeding agent data..."
      />
    );
  }

  const primary = agents.filter((a) => a.type === "primary");
  const subagents = agents.filter((a) => a.type === "subagent");

  return (
    <div>
      {/* Primary Agent */}
      {primary.length > 0 && (
        <div className="mb-6">
          <GlassCard glowEffect={false} className="px-4 py-3 mb-3">
            <h2
              className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-primary)", boxShadow: "0 0 6px var(--accent-primary)" }} />
              Primary Agent
            </h2>
          </GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 stagger-children">
            {primary.map((agent) => (
              <AgentCard
                key={agent._id}
                agent={agent}
                onClick={() => {
                  setSelectedAgent(agent);
                  setProfileOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sub-Agents */}
      <div>
        <GlassCard glowEffect={false} className="px-4 py-3 mb-3">
          <h2
            className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent-success)", boxShadow: "0 0 6px var(--accent-success)" }} />
            Sub-Agents ({subagents.length})
          </h2>
        </GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 stagger-children">
          {subagents.map((agent) => (
            <AgentCard
              key={agent._id}
              agent={agent}
              onClick={() => {
                setSelectedAgent(agent);
                setProfileOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <AgentProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        agent={selectedAgent}
      />
    </div>
  );
}
