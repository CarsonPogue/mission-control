"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Doc } from "../../convex/_generated/dataModel";
import Badge from "@/components/ui/Badge";
import { relativeTime } from "@/lib/utils";
import { AGENT_ROLE_COLORS } from "@/lib/constants";

export default function MemoryCard({
  memory,
  onClick,
}: {
  memory: Doc<"memories">;
  onClick: () => void;
}) {
  return (
    <GlassCard
      onClick={onClick}
      className="p-4"
      style={{ borderLeft: "2px solid var(--accent-purple)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className="text-sm font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {memory.title}
        </h3>
        <span
          className="text-[10px] flex-shrink-0"
          style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
        >
          {relativeTime(memory.createdAt)}
        </span>
      </div>

      <p
        className="text-xs leading-relaxed mb-3 line-clamp-3"
        style={{ color: "var(--text-secondary)" }}
      >
        {memory.content}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {memory.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-[10px] tracking-wider uppercase"
            style={{
              fontFamily: "var(--font-code)",
              background: "var(--glass-bg-hover)",
              color: "var(--text-muted)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {tag}
          </span>
        ))}
        {memory.agentId && (
          <Badge label={memory.agentId} color={AGENT_ROLE_COLORS[memory.agentId] ?? "#AF52DE"} />
        )}
      </div>
    </GlassCard>
  );
}
