"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Doc } from "../../convex/_generated/dataModel";
import Badge from "@/components/ui/Badge";
import { relativeTime } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ContentCard({
  item,
  onClick,
}: {
  item: Doc<"contentItems">;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPublished = item.stage === "published";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GlassCard
        onClick={onClick}
        className="p-3.5"
      >
        <h4
          className="text-xs font-semibold leading-tight mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          {item.title}
        </h4>

        {item.notes && (
          <p
            className="text-[11px] leading-relaxed mb-2 line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {item.notes}
          </p>
        )}

        <div className="flex items-center gap-2">
          {item.script && <Badge label="Has Script" color="#34C759" />}
          {item.assignedAgentId && <Badge label={item.assignedAgentId} color="#AF52DE" />}
        </div>

        <div
          className="mt-2 text-[10px]"
          style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
        >
          {relativeTime(item.updatedAt)}
        </div>
      </GlassCard>
    </div>
  );
}
