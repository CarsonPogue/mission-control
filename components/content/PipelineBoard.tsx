"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ContentCard from "./ContentCard";
import ScriptEditor from "./ScriptEditor";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui/LoadingState";
import { GlassCard } from "@/components/ui/glass-card";
import { CONTENT_STAGES, CONTENT_STAGE_LABELS, type ContentStage } from "@/lib/constants";

const STAGE_COLORS: Record<ContentStage, string> = {
  idea: "#007AFF",
  script: "#AF52DE",
  thumbnail: "#FF9500",
  filming: "#FF6B00",
  editing: "#FF3B30",
  published: "#34C759",
};

export default function PipelineBoard() {
  const items = useQuery(api.content.list);
  const updateContent = useMutation(api.content.update);

  const [selectedItem, setSelectedItem] = useState<Doc<"contentItems"> | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (items === undefined) return <LoadingState label="Loading pipeline..." />;

  const columns = CONTENT_STAGES.map((stage) => ({
    stage,
    label: CONTENT_STAGE_LABELS[stage],
    color: STAGE_COLORS[stage],
    items: items.filter((i) => i.stage === stage),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((i) => i._id === active.id);
    if (!activeItem) return;

    const targetStage = CONTENT_STAGES.find((s) => s === over.id);
    if (targetStage && targetStage !== activeItem.stage) {
      await updateContent({ id: activeItem._id, stage: targetStage });
      return;
    }

    const targetItem = items.find((i) => i._id === over.id);
    if (targetItem && targetItem.stage !== activeItem.stage) {
      await updateContent({ id: activeItem._id, stage: targetItem.stage });
    }
  };

  const activeItem = activeId ? items.find((i) => i._id === activeId) : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Button onClick={() => setCreateOpen(true)}>+ Add Idea</Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 stagger-children">
          {columns.map((col) => (
            <SortableContext
              key={col.stage}
              id={col.stage}
              items={col.items.map((i) => i._id)}
              strategy={verticalListSortingStrategy}
            >
              <GlassCard glowEffect={false} className="flex-shrink-0 w-[220px] overflow-hidden">
                <div
                  className="px-3 py-2.5"
                  style={{
                    borderBottom: "1px solid var(--glass-border)",
                    background: `linear-gradient(135deg, ${col.color}08, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: col.color, boxShadow: `0 0 6px ${col.color}50` }}
                    />
                    <span
                      className="text-[10px] font-bold tracking-[0.15em] uppercase"
                      style={{ fontFamily: "var(--font-display)", color: col.color }}
                    >
                      {col.label}
                    </span>
                    <span
                      className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        fontFamily: "var(--font-code)",
                        background: "var(--glass-bg-hover)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {col.items.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-2 min-h-[200px]">
                  {col.items.length === 0 ? (
                    <div
                      className="py-6 text-center text-[11px]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-code)" }}
                    >
                      Empty
                    </div>
                  ) : (
                    col.items.map((item) => (
                      <ContentCard
                        key={item._id}
                        item={item}
                        onClick={() => {
                          setSelectedItem(item);
                          setEditorOpen(true);
                        }}
                      />
                    ))
                  )}
                </div>
              </GlassCard>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeItem && (
            <GlassCard
              className="p-3 rotate-1 w-[200px]"
            >
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {activeItem.title}
              </span>
            </GlassCard>
          )}
        </DragOverlay>
      </DndContext>

      <ScriptEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        item={selectedItem}
      />
      <ScriptEditor
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
