import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("done")
    ),
    assignee: v.union(v.literal("me"), v.literal("agent")),
    agentId: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  contentItems: defineTable({
    title: v.string(),
    stage: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    ),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    assignedAgentId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  calendarEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("scheduled_task"),
      v.literal("cron_job"),
      v.literal("meeting"),
      v.literal("reminder")
    ),
    agentId: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    recurrence: v.optional(v.string()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
  }),

  memories: defineTable({
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    agentId: v.optional(v.string()),
    sourceConversation: v.optional(v.string()),
    createdAt: v.number(),
  }).searchIndex("search_memories", {
    searchField: "content",
    filterFields: ["tags", "agentId"],
  }),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    responsibilities: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
    avatarSeed: v.string(),
    type: v.union(v.literal("primary"), v.literal("subagent")),
    parentAgentId: v.optional(v.string()),
  }),
});
