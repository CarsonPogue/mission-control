import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const get = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("agents").collect();
    return all.find((a) => a.name === args.name) ?? null;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { status: args.status };
    if (args.currentTask !== undefined) {
      updates.currentTask = args.currentTask;
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    if (existing.length > 0) return;

    const agents = [
      {
        name: "Director",
        role: "Primary Orchestrator",
        responsibilities: [
          "Coordinates all sub-agents",
          "Manages the task board",
          "Handles scheduling",
          "Maintains memory",
        ],
        status: "active" as const,
        avatarSeed: "director",
        type: "primary" as const,
      },
      {
        name: "Axiom",
        role: "Full-Stack Developer",
        responsibilities: [
          "Next.js development",
          "Convex schema",
          "API integrations",
          "Debugging",
          "Code review",
        ],
        status: "idle" as const,
        avatarSeed: "axiom",
        type: "subagent" as const,
      },
      {
        name: "Quill",
        role: "Content Writer",
        responsibilities: [
          "Script writing",
          "Blog posts",
          "Social copy",
          "SEO optimization",
          "Content pipeline management",
        ],
        status: "idle" as const,
        avatarSeed: "quill",
        type: "subagent" as const,
      },
      {
        name: "Prism",
        role: "UI/UX Designer",
        responsibilities: [
          "Component design",
          "Visual direction",
          "Figma handoffs",
          "Design system maintenance",
        ],
        status: "idle" as const,
        avatarSeed: "prism",
        type: "subagent" as const,
      },
      {
        name: "Ledger",
        role: "Data Analyst",
        responsibilities: [
          "Financial modeling",
          "Revenue analysis",
          "SEO audit reports",
          "Data visualization",
        ],
        status: "offline" as const,
        avatarSeed: "ledger",
        type: "subagent" as const,
      },
      {
        name: "Beacon",
        role: "Marketing Strategist",
        responsibilities: [
          "Campaign planning",
          "Distribution strategy",
          "Audience analysis",
          "Brand positioning",
        ],
        status: "offline" as const,
        avatarSeed: "beacon",
        type: "subagent" as const,
      },
      {
        name: "Forge",
        role: "DevOps / Infrastructure",
        responsibilities: [
          "VPS management",
          "Server configs",
          "Domain setup",
          "Cron job maintenance",
          "CI/CD",
        ],
        status: "idle" as const,
        avatarSeed: "forge",
        type: "subagent" as const,
      },
      {
        name: "Glitch",
        role: "Debugging Specialist",
        responsibilities: [
          "Error diagnosis",
          "Log analysis",
          "Root cause identification",
          "Fix implementation and verification",
        ],
        status: "offline" as const,
        avatarSeed: "glitch",
        type: "subagent" as const,
      },
    ];

    for (const agent of agents) {
      await ctx.db.insert("agents", agent);
    }
  },
});
