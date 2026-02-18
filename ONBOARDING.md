# Mission Control — Agent Integration Guide

> How to wire your agents into Mission Control so every action, task, memory, and status change shows up in real time.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              YOUR BOT / ORCHESTRATOR             │
│         (OpenClaw, Claude, custom agent)         │
│                                                  │
│   ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│   │  Director  │  │   Axiom   │  │   Quill   │   │
│   │ (primary)  │  │  (code)   │  │ (content) │   │
│   └─────┬─────┘  └─────┬─────┘  └─────┬─────┘   │
│         │              │              │          │
│         └──────────────┼──────────────┘          │
│                        │                         │
│                   Convex API                     │
│                        │                         │
└────────────────────────┼─────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   MISSION CONTROL   │
              │   (Next.js + Convex)│
              │                     │
              │  /tasks    /memory  │
              │  /team     /office  │
              │  /calendar /content │
              └─────────────────────┘
```

**Mission Control is the dashboard.** Your agents are the workers. They communicate through Convex.

---

## Step 1: Convex HTTP Endpoints

To let external agents write data into Mission Control, you need HTTP endpoints. Create this file:

### `convex/http.ts`

```ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// ── TASKS ────────────────────────────────────────

// POST /api/tasks/create
http.route({
  path: "/api/tasks/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.tasks.create, body);
    return new Response(JSON.stringify({ id }), { status: 200 });
  }),
});

// POST /api/tasks/update
http.route({
  path: "/api/tasks/update",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.tasks.update, body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }),
});

// ── MEMORY ───────────────────────────────────────

// POST /api/memory/create
http.route({
  path: "/api/memory/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.memory.create, body);
    return new Response(JSON.stringify({ id }), { status: 200 });
  }),
});

// ── AGENTS ───────────────────────────────────────

// POST /api/agents/status
http.route({
  path: "/api/agents/status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    await ctx.runMutation(api.agents.updateStatus, body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }),
});

// ── CALENDAR ─────────────────────────────────────

// POST /api/calendar/create
http.route({
  path: "/api/calendar/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.calendar.create, body);
    return new Response(JSON.stringify({ id }), { status: 200 });
  }),
});

// ── CONTENT ──────────────────────────────────────

// POST /api/content/create
http.route({
  path: "/api/content/create",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const id = await ctx.runMutation(api.content.create, body);
    return new Response(JSON.stringify({ id }), { status: 200 });
  }),
});

export default http;
```

Your Convex site URL (for HTTP endpoints) is in `.env.local` as `NEXT_PUBLIC_CONVEX_SITE_URL`.

---

## Step 2: Agent Lifecycle

Every agent interaction should follow this pattern:

### When an agent STARTS a task:

```
1. Set agent status → "active"
2. Set agent currentTask → "Description of what I'm doing"
3. Create or update task on the board → status: "in_progress"
```

**API calls:**
```bash
# Set agent active
curl -X POST $CONVEX_SITE_URL/api/agents/status \
  -H "Content-Type: application/json" \
  -d '{"id": "<agent_convex_id>", "status": "active", "currentTask": "Building auth system"}'

# Create task
curl -X POST $CONVEX_SITE_URL/api/tasks/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build auth system",
    "description": "Implement JWT-based authentication",
    "status": "in_progress",
    "assignee": "agent",
    "agentId": "Axiom",
    "priority": "high"
  }'
```

### When an agent COMPLETES a task:

```
1. Update task → status: "done"
2. Log a memory entry summarizing what was done
3. Set agent status → "idle"
4. Clear agent currentTask
```

**API calls:**
```bash
# Mark task done
curl -X POST $CONVEX_SITE_URL/api/tasks/update \
  -H "Content-Type: application/json" \
  -d '{"id": "<task_convex_id>", "status": "done"}'

# Log memory
curl -X POST $CONVEX_SITE_URL/api/memory/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Built auth system",
    "content": "Implemented JWT auth with refresh tokens. Used bcrypt for password hashing. Added middleware to protect API routes.",
    "tags": ["technical", "auth"],
    "agentId": "Axiom"
  }'

# Set agent idle
curl -X POST $CONVEX_SITE_URL/api/agents/status \
  -H "Content-Type: application/json" \
  -d '{"id": "<agent_convex_id>", "status": "idle"}'
```

### When an agent ENCOUNTERS a failure:

```
1. Update task → status: "blocked"
2. Log a memory with the error context
3. If it's a calendar job, mark the event → status: "failed"
4. Optionally: create a follow-up task for Glitch (debugging agent)
```

---

## Step 3: Director Routing Logic

The **Director** agent is the router. When your bot receives a request, the Director decides which sub-agent handles it.

### Routing Table

| Trigger Keywords | Route To | Agent ID |
|-----------------|----------|----------|
| code, build, fix bug, API, database, deploy | **Axiom** | `Axiom` |
| write, script, blog, copy, SEO content | **Quill** | `Quill` |
| design, UI, component, layout, visual | **Prism** | `Prism` |
| data, analytics, revenue, metrics, report | **Ledger** | `Ledger` |
| marketing, campaign, audience, distribution | **Beacon** | `Beacon` |
| server, VPS, domain, cron, CI/CD, infra | **Forge** | `Forge` |
| error, bug, crash, debug, broken, failing | **Glitch** | `Glitch` |

### Example Director Prompt

Give this to your orchestrator bot as a system prompt:

```
You are Director, the primary orchestrator for Mission Control.

When you receive a task:
1. Analyze the request and determine which sub-agent should handle it
2. Set your status to "active" in Mission Control
3. Create a task on the board assigned to the appropriate agent
4. Delegate to that agent with their system prompt
5. Monitor completion and update the board

Sub-agents available:
- Axiom (code) — anything technical
- Quill (content) — anything written
- Prism (design) — anything visual
- Ledger (data) — anything analytical
- Beacon (marketing) — anything growth
- Forge (infra) — anything ops
- Glitch (debug) — anything broken

After every delegation, update Mission Control:
- POST /api/tasks/create — log the task
- POST /api/agents/status — mark agent active
- POST /api/memory/create — log decisions

Your Convex Site URL: <your-url-here>
```

---

## Step 4: Sub-Agent System Prompts

Each sub-agent should receive their system prompt (from the master prompt) PLUS these instructions:

```
MISSION CONTROL INTEGRATION:
- When you start work, update your status to "active" via the API
- When you finish, mark the task "done" and log a memory entry
- When you fail, mark the task "blocked" and explain why in memory
- Always tag your memories: ["technical"], ["content"], ["design"], etc.
- Never delete tasks — mark them done
- Never delete memories — they are permanent knowledge

API Base URL: $CONVEX_SITE_URL
```

### Full sub-agent system prompts are in:
`MISSION_CONTROL_MASTER_PROMPT.md` → "Sub-Agent System Prompts" section

---

## Step 5: Scheduling & Automation

When any agent sets up a recurring task or automation:

```bash
# Create calendar entry
curl -X POST $CONVEX_SITE_URL/api/calendar/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Daily SEO audit",
    "description": "Ledger runs SEO analysis every morning",
    "type": "cron_job",
    "agentId": "Ledger",
    "startTime": 1708300800000,
    "recurrence": "Daily at 9am"
  }'
```

Event types:
- `scheduled_task` — one-time scheduled work (blue)
- `cron_job` — recurring automation (purple)
- `meeting` — time blocks (green)
- `reminder` — alerts (amber)

---

## Step 6: Content Pipeline

When Quill (or any agent) works on content:

```
Idea → Script → Thumbnail → Filming → Editing → Published
```

```bash
# Add a content idea
curl -X POST $CONVEX_SITE_URL/api/content/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How I Built an AI Agent Army",
    "stage": "idea",
    "notes": "Viral potential. Show the Mission Control dashboard.",
    "assignedAgentId": "Quill"
  }'
```

Agents should move cards forward through stages as work progresses.

---

## Agent ID Reference

These are the agent names used across all tables. Use these exact strings for `agentId` fields:

| Agent | ID String | Type |
|-------|-----------|------|
| Director | `Director` | primary |
| Axiom | `Axiom` | subagent |
| Quill | `Quill` | subagent |
| Prism | `Prism` | subagent |
| Ledger | `Ledger` | subagent |
| Beacon | `Beacon` | subagent |
| Forge | `Forge` | subagent |
| Glitch | `Glitch` | subagent |

> **Note:** Agent Convex `_id` values (for status updates) are different from these name strings. Query `/api/agents/list` to get the Convex IDs, or use the Team page in the dashboard.

---

## Quick Start Checklist

- [ ] Deploy `convex/http.ts` with HTTP endpoints (`npx convex dev` will auto-deploy)
- [ ] Note your `NEXT_PUBLIC_CONVEX_SITE_URL` from `.env.local`
- [ ] Add Director system prompt to your bot
- [ ] Add sub-agent system prompts with Mission Control API instructions
- [ ] Test: create a task via API → verify it appears on `/tasks`
- [ ] Test: create a memory via API → verify it appears on `/memory`
- [ ] Test: update agent status → verify it appears on `/team` and `/office`
- [ ] Set up your routing logic (Director decides which agent handles what)
- [ ] Start delegating

---

## Data Flow Summary

```
User sends request
       │
       ▼
   Director analyzes
       │
       ├── Creates task on board (POST /api/tasks/create)
       ├── Sets sub-agent active (POST /api/agents/status)
       │
       ▼
   Sub-agent works
       │
       ├── Updates task progress (POST /api/tasks/update)
       │
       ▼
   Sub-agent completes
       │
       ├── Marks task done (POST /api/tasks/update)
       ├── Logs memory (POST /api/memory/create)
       ├── Sets self idle (POST /api/agents/status)
       │
       ▼
   Mission Control reflects all changes in real time
```

Everything syncs instantly via Convex. Open Mission Control and watch your agents work.
