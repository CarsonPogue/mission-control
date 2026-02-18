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
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingState from "@/components/ui/LoadingState";
import { GlassCard } from "@/components/ui/glass-card";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  PRIORITIES,
  type Priority,
} from "@/lib/constants";

export default function KanbanBoard() {
  const tasks = useQuery(api.tasks.list);
  const updateTask = useMutation(api.tasks.update);
  const agents = useQuery(api.agents.list);

  const [selectedTask, setSelectedTask] = useState<Doc<"tasks"> | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (tasks === undefined) return <LoadingState label="Loading tasks..." />;

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterAssignee !== "all") {
      if (filterAssignee === "me" && t.assignee !== "me") return false;
      if (filterAssignee !== "me" && t.agentId !== filterAssignee) return false;
    }
    return true;
  });

  const columns = TASK_STATUSES.map((status) => ({
    status,
    label: TASK_STATUS_LABELS[status],
    color: TASK_STATUS_COLORS[status],
    tasks: filteredTasks.filter((t) => t.status === status),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const activeTask = tasks.find((t) => t._id === active.id);
    if (!activeTask) return;

    const targetStatus = TASK_STATUSES.find((s) => s === overId);
    if (targetStatus && targetStatus !== activeTask.status) {
      await updateTask({ id: activeTask._id, status: targetStatus });
      return;
    }

    const targetTask = tasks.find((t) => t._id === overId);
    if (targetTask && targetTask.status !== activeTask.status) {
      await updateTask({ id: activeTask._id, status: targetTask.status });
    }
  };

  const handleOpenTask = (task: Doc<"tasks">) => {
    setSelectedTask(task);
    setCreateMode(false);
    setModalOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setCreateMode(true);
    setModalOpen(true);
  };

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  return (
    <div>
      {/* Filter bar */}
      <GlassCard glowEffect={false} className="flex items-center gap-3 mb-5 flex-wrap px-4 py-3">
        <Button onClick={handleNewTask}>+ New Task</Button>
        <Select value={filterPriority} onValueChange={(val) => setFilterPriority(val as Priority | "all")}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="me">Me</SelectItem>
            {agents
              ?.filter((a) => a.type === "subagent")
              .map((a) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
          {columns.map((col) => (
            <SortableContext
              key={col.status}
              id={col.status}
              items={col.tasks.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <GlassCard glowEffect={false} className="min-h-[300px] overflow-hidden">
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{
                    borderBottom: "1px solid var(--glass-border)",
                    background: `linear-gradient(135deg, ${col.color}08, transparent)`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: col.color, boxShadow: `0 0 6px ${col.color}50` }}
                  />
                  <span
                    className="text-[11px] font-bold tracking-[0.15em] uppercase"
                    style={{ fontFamily: "var(--font-display)", color: col.color }}
                  >
                    {col.label}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                    style={{
                      fontFamily: "var(--font-code)",
                      background: "var(--glass-bg-hover)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {col.tasks.length}
                  </span>
                </div>
                <div className="p-2 flex flex-col gap-2">
                  {col.tasks.length === 0 ? (
                    <div
                      className="py-8 text-center text-[11px]"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-code)" }}
                    >
                      No tasks
                    </div>
                  ) : (
                    col.tasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onClick={() => handleOpenTask(task)}
                      />
                    ))
                  )}
                </div>
              </GlassCard>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <GlassCard
              className="p-3 rotate-2"
            >
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {activeTask.title}
              </span>
            </GlassCard>
          )}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={createMode ? null : selectedTask}
      />
    </div>
  );
}
