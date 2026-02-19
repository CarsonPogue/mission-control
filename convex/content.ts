import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentItems").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    stage: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("script"),
        v.literal("thumbnail"),
        v.literal("filming"),
        v.literal("editing"),
        v.literal("published")
      )
    ),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    assignedAgentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contentItems", {
      title: args.title,
      stage: args.stage ?? "idea",
      script: args.script,
      notes: args.notes,
      thumbnailUrl: args.thumbnailUrl,
      assignedAgentId: args.assignedAgentId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contentItems"),
    title: v.optional(v.string()),
    stage: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("script"),
        v.literal("thumbnail"),
        v.literal("filming"),
        v.literal("editing"),
        v.literal("published")
      )
    ),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    assignedAgentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
