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

// Handle CORS preflight for all routes
http.route({
  path: "/api/tasks/create",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/tasks/update",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/tasks/list",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/memory/create",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/memory/list",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/agents/status",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/agents/list",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/calendar/create",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/calendar/update",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/content/create",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});
http.route({
  path: "/api/content/update",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

// ── TASKS ────────────────────────────────────────

http.route({
  path: "/api/tasks/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.tasks.create, body);
    return jsonResponse({ id });
  }),
});

http.route({
  path: "/api/tasks/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.tasks.update, body);
    return jsonResponse({ success: true });
  }),
});

http.route({
  path: "/api/tasks/list",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const tasks = await ctx.runQuery(api.tasks.list);
    return jsonResponse(tasks);
  }),
});

// ── MEMORY ───────────────────────────────────────

http.route({
  path: "/api/memory/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.memory.create, body);
    return jsonResponse({ id });
  }),
});

http.route({
  path: "/api/memory/list",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const memories = await ctx.runQuery(api.memory.list);
    return jsonResponse(memories);
  }),
});

// ── AGENTS ───────────────────────────────────────

http.route({
  path: "/api/agents/status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.agents.updateStatus, body);
    return jsonResponse({ success: true });
  }),
});

http.route({
  path: "/api/agents/list",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const agents = await ctx.runQuery(api.agents.list);
    return jsonResponse(agents);
  }),
});

// ── CALENDAR ─────────────────────────────────────

http.route({
  path: "/api/calendar/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.calendar.create, body);
    return jsonResponse({ id });
  }),
});

http.route({
  path: "/api/calendar/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.calendar.update, body);
    return jsonResponse({ success: true });
  }),
});

// ── CONTENT ──────────────────────────────────────

http.route({
  path: "/api/content/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.content.create, body);
    return jsonResponse({ id });
  }),
});

http.route({
  path: "/api/content/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.content.update, body);
    return jsonResponse({ success: true });
  }),
});

export default http;
