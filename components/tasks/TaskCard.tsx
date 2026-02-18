"use client";

import { GlassCard } from "@/components/ui/glass-card";
import Badge from "@/components/ui/Badge";
import { PRIORITY_COLORS } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";
import { Doc } from "../../convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({
  task,
  onClick,
}: {
  task: Doc<"tasks">;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = PRIORITY_COLORS[task.priority];
  const isCritical = task.priority === "critical";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GlassCard
        onClick={onClick}
        className={`p-3.5${isCritical ? " priority-critical-ring" : ""}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4
            className="text-xs font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {task.title}
          </h4>
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
            style={{ background: priorityColor, boxShadow: `0 0 6px ${priorityColor}50` }}
          />
        </div>

        {task.description && (
          <p
            className="text-[11px] leading-relaxed mb-2.5 line-clamp-2"
            style={{ color: "var(--text-muted)" }}
          >
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={task.priority} color={priorityColor} pulse={isCritical} />
          <Badge
            label={task.assignee === "me" ? "Me" : task.agentId ?? "Agent"}
            color={task.assignee === "me" ? "#4f8ef7" : "#2dd4a0"}
          />
        </div>

        {task.dueDate && (
          <div
            className="mt-2.5 text-[10px]"
            style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
          >
            Due {relativeTime(task.dueDate)}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
