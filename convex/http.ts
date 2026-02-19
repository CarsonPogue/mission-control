import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function corsOptions() {
  return httpAction(async () => new Response(null, { status: 204, headers: corsHeaders }));
}

function postHandler(fn: (ctx: any, body: any) => Promise<unknown>) {
  return httpAction(async (ctx, request) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    try {
      const result = await fn(ctx, body);
      return jsonResponse(result ?? { success: true });
    } catch (e: any) {
      return jsonResponse({ error: e.message ?? "Internal error" }, 400);
    }
  });
}

// ── CORS PREFLIGHT ──────────────────────────────

const postRoutes = [
  "/api/tasks/create", "/api/tasks/update", "/api/tasks/remove",
  "/api/memory/create", "/api/memory/update", "/api/memory/remove", "/api/memory/search",
  "/api/agents/status", "/api/agents/seed",
  "/api/calendar/create", "/api/calendar/update", "/api/calendar/remove",
  "/api/content/create", "/api/content/update", "/api/content/remove",
];
const getRoutes = [
  "/api/tasks/list",
  "/api/memory/list",
  "/api/agents/list", "/api/agents/get", "/api/agents/getByName",
  "/api/calendar/list",
  "/api/content/list",
];

for (const path of [...postRoutes, ...getRoutes]) {
  http.route({ path, method: "OPTIONS", handler: corsOptions() });
}

// ── TASKS ────────────────────────────────────────

http.route({
  path: "/api/tasks/list",
  method: "GET",
  handler: httpAction(async (ctx) => jsonResponse(await ctx.runQuery(api.tasks.list))),
});

http.route({
  path: "/api/tasks/create",
  method: "POST",
  handler: postHandler(async (ctx, body) => ({ id: await ctx.runMutation(api.tasks.create, body) })),
});

http.route({
  path: "/api/tasks/update",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.tasks.update, body); }),
});

http.route({
  path: "/api/tasks/remove",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.tasks.remove, body); }),
});

// ── MEMORY ───────────────────────────────────────

http.route({
  path: "/api/memory/list",
  method: "GET",
  handler: httpAction(async (ctx) => jsonResponse(await ctx.runQuery(api.memory.list))),
});

http.route({
  path: "/api/memory/create",
  method: "POST",
  handler: postHandler(async (ctx, body) => ({ id: await ctx.runMutation(api.memory.create, body) })),
});

http.route({
  path: "/api/memory/update",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.memory.update, body); }),
});

http.route({
  path: "/api/memory/remove",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.memory.remove, body); }),
});

http.route({
  path: "/api/memory/search",
  method: "POST",
  handler: postHandler(async (ctx, body) => await ctx.runQuery(api.memory.search, body)),
});

// ── AGENTS ───────────────────────────────────────

http.route({
  path: "/api/agents/list",
  method: "GET",
  handler: httpAction(async (ctx) => jsonResponse(await ctx.runQuery(api.agents.list))),
});

http.route({
  path: "/api/agents/get",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return jsonResponse({ error: "Missing id parameter" }, 400);
    try {
      const agent = await ctx.runQuery(api.agents.get, { id: id as any });
      return jsonResponse(agent);
    } catch (e: any) {
      return jsonResponse({ error: e.message ?? "Not found" }, 404);
    }
  }),
});

http.route({
  path: "/api/agents/getByName",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    if (!name) return jsonResponse({ error: "Missing name parameter" }, 400);
    const agent = await ctx.runQuery(api.agents.getByName, { name });
    return jsonResponse(agent);
  }),
});

http.route({
  path: "/api/agents/status",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.agents.updateStatus, body); }),
});

http.route({
  path: "/api/agents/seed",
  method: "POST",
  handler: postHandler(async (ctx) => { await ctx.runMutation(api.agents.seed, {}); }),
});

// ── CALENDAR ─────────────────────────────────────

http.route({
  path: "/api/calendar/list",
  method: "GET",
  handler: httpAction(async (ctx) => jsonResponse(await ctx.runQuery(api.calendar.list))),
});

http.route({
  path: "/api/calendar/create",
  method: "POST",
  handler: postHandler(async (ctx, body) => ({ id: await ctx.runMutation(api.calendar.create, body) })),
});

http.route({
  path: "/api/calendar/update",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.calendar.update, body); }),
});

http.route({
  path: "/api/calendar/remove",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.calendar.remove, body); }),
});

// ── CONTENT ──────────────────────────────────────

http.route({
  path: "/api/content/list",
  method: "GET",
  handler: httpAction(async (ctx) => jsonResponse(await ctx.runQuery(api.content.list))),
});

http.route({
  path: "/api/content/create",
  method: "POST",
  handler: postHandler(async (ctx, body) => ({ id: await ctx.runMutation(api.content.create, body) })),
});

http.route({
  path: "/api/content/update",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.content.update, body); }),
});

http.route({
  path: "/api/content/remove",
  method: "POST",
  handler: postHandler(async (ctx, body) => { await ctx.runMutation(api.content.remove, body); }),
});

export default http;
