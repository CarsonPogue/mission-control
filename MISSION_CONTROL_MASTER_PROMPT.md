# MISSION CONTROL — Onboarding & Data Routing Guide

> **Stack:** Next.js 14 (App Router) + Convex (real-time database) + Tailwind CSS
> **Purpose:** A personal command center for managing AI agent workflows, tasks, content, memory, team structure, and proactive automation.
> **Convex Deployment:** `https://tough-mastiff-574.convex.cloud`

---

## How to Route Data

All data flows through Convex. There are two ways to interact:

### 1. HTTP API (for external agents / OpenClaw)

Base URL: `https://tough-mastiff-574.convex.cloud`

All endpoints accept JSON, return JSON, and have full CORS support.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tasks/create` | POST | Create a new task |
| `/api/tasks/update` | POST | Update an existing task |
| `/api/tasks/list` | GET | List all tasks |
| `/api/memory/create` | POST | Create a memory entry |
| `/api/memory/list` | GET | List all memories |
| `/api/agents/status` | POST | Update an agent's status |
| `/api/agents/list` | GET | List all agents |
| `/api/calendar/create` | POST | Create a calendar event |
| `/api/calendar/update` | POST | Update a calendar event |
| `/api/content/create` | POST | Create a content item |
| `/api/content/update` | POST | Update a content item |

### 2. Convex Client (for frontend components)

Components use `useQuery(api.xxx.list)` and `useMutation(api.xxx.create)` from `convex/react`. All data syncs in real time across all connected clients.

---

## Data Schema Reference

### Tasks Table

```
POST /api/tasks/create
{
  "title": "Build login page",           // required, string
  "description": "OAuth + email login",  // optional, string
  "status": "todo",                      // required: "todo" | "in_progress" | "blocked" | "done"
  "assignee": "agent",                   // required: "me" | "agent"
  "agentId": "Axiom",                    // optional, string — agent name when assignee="agent"
  "priority": "high",                    // required: "low" | "medium" | "high" | "critical"
  "dueDate": 1708300800000              // optional, unix timestamp in ms
}
```

```
POST /api/tasks/update
{
  "id": "k57abc123...",                  // required, Convex document ID
  "status": "done",                      // any field from create (all optional)
  "title": "Updated title"
}
```

```
GET /api/tasks/list
→ Returns array of all tasks, newest first
```

**Auto-set fields:** `createdAt` (on create), `updatedAt` (on create + every update)

---

### Memory Table

```
POST /api/memory/create
{
  "title": "API Design Decision",       // required, string
  "content": "We chose REST over...",   // required, string — full text, searchable
  "tags": ["technical", "api"],         // required, array of strings
  "agentId": "Axiom",                   // optional, string — which agent created this
  "sourceConversation": "session-42"    // optional, string — reference to source
}
```

```
GET /api/memory/list
→ Returns array of all memories, newest first
```

**Search:** The frontend supports full-text search on the `content` field via Convex search index. Filter by `tags` and `agentId`.

**Auto-set fields:** `createdAt` (on create)

**Note:** Memories have no delete endpoint. They are permanent knowledge records.

---

### Agents Table

```
POST /api/agents/status
{
  "id": "k57abc123...",                  // required, Convex document ID
  "status": "active",                   // required: "active" | "idle" | "offline"
  "currentTask": "Building auth flow"   // optional, string — what agent is working on
}
```

```
GET /api/agents/list
→ Returns array of all agents
```

**Pre-seeded agents** (auto-created on first visit):

| Name | Role | Type |
|------|------|------|
| Director | Primary Orchestrator | primary |
| Axiom | Full-Stack Developer | subagent |
| Quill | Content Writer | subagent |
| Prism | UI/UX Designer | subagent |
| Ledger | Data Analyst | subagent |
| Beacon | Marketing Strategist | subagent |
| Forge | DevOps / Infrastructure | subagent |
| Glitch | Debugging Specialist | subagent |

Each agent has: `name`, `role`, `responsibilities` (array), `status`, `currentTask` (optional), `avatarSeed`, `type` ("primary" | "subagent"), `parentAgentId` (optional).

---

### Calendar Events Table

```
POST /api/calendar/create
{
  "title": "Deploy v2",                 // required, string
  "description": "Production deploy",   // optional, string
  "type": "scheduled_task",             // required: "scheduled_task" | "cron_job" | "meeting" | "reminder"
  "agentId": "Forge",                   // optional, string — agent name
  "startTime": 1708300800000,           // required, unix timestamp in ms
  "endTime": 1708304400000,             // optional, unix timestamp in ms
  "recurrence": "Daily at 9am",         // optional, string — human-readable pattern
  "status": "upcoming"                  // optional, defaults to "upcoming": "upcoming" | "running" | "completed" | "failed"
}
```

```
POST /api/calendar/update
{
  "id": "k57abc123...",                  // required, Convex document ID
  "status": "completed"                  // any field from create (all optional)
}
```

**Note:** Calendar events can also be deleted via the frontend UI.

---

### Content Items Table

```
POST /api/content/create
{
  "title": "Video: How AI Works",       // required, string
  "stage": "idea",                       // optional, defaults to "idea": "idea" | "script" | "thumbnail" | "filming" | "editing" | "published"
  "script": "In this video...",          // optional, string — full script text
  "notes": "Need B-roll of...",          // optional, string
  "assignedAgentId": "Quill"            // optional, string — agent name
}
```

```
POST /api/content/update
{
  "id": "k57abc123...",                  // required, Convex document ID
  "stage": "script",                     // any field from create (all optional)
  "script": "Updated script..."
}
```

**Auto-set fields:** `createdAt` (on create), `updatedAt` (on create + every update)

---

## Agent Workflow Routing

When an agent performs work, it should update Mission Control in this order:

### 1. Set yourself active
```
POST /api/agents/status
{ "id": "<your-agent-id>", "status": "active", "currentTask": "Working on X" }
```

### 2. Create or update the task
```
POST /api/tasks/create
{ "title": "X", "status": "in_progress", "assignee": "agent", "agentId": "YourName", "priority": "medium" }
```

### 3. Log decisions to memory
```
POST /api/memory/create
{ "title": "Decision: X", "content": "Full details...", "tags": ["technical"], "agentId": "YourName" }
```

### 4. Schedule follow-ups
```
POST /api/calendar/create
{ "title": "Follow up on X", "type": "reminder", "agentId": "YourName", "startTime": 1708387200000 }
```

### 5. Mark task done & go idle
```
POST /api/tasks/update
{ "id": "<task-id>", "status": "done" }

POST /api/agents/status
{ "id": "<your-agent-id>", "status": "idle", "currentTask": null }
```

---

## Data Relationships

```
agents ──→ tasks        (via task.agentId = agent.name, when assignee="agent")
agents ──→ memories     (via memory.agentId = agent.name)
agents ──→ calendar     (via event.agentId = agent.name)
agents ──→ content      (via content.assignedAgentId = agent.name)
```

**Important:** All agent references use the agent's **name** (string), not the Convex document `_id`. When creating data linked to an agent, use the agent's name (e.g., "Axiom", "Quill", "Director").

---

## Frontend Screens & What They Display

| Route | Component | Data Source | Purpose |
|-------|-----------|-------------|---------|
| `/` | HomePage | agents.list | Dashboard with nav grid, agent count |
| `/tasks` | KanbanBoard + TaskModal | tasks.list, agents.list | 4-column kanban (todo/in_progress/blocked/done), drag-and-drop |
| `/memory` | MemoryList + MemoryModal | memory.list, memory.search, agents.list | Searchable memory log with tag/agent filters |
| `/team` | TeamGrid + AgentProfile | agents.list | Agent roster, status updates |
| `/calendar` | CalendarView + EventModal + EventDetail | calendar.list, agents.list | Month/week view, event CRUD |
| `/content` | PipelineBoard + ScriptEditor | content.list, agents.list | 6-stage pipeline (idea→published), drag-and-drop |
| `/office` | OfficeView + WorkstationTile | agents.list | Digital office, efficiency meter, activity ticker |

---

## Agent Roster & System Prompts

### Director — Primary Orchestrator
> Coordinates all sub-agents, manages the task board, handles scheduling, maintains memory. The single point of contact for all orchestration.

### Axiom — Full-Stack Developer
> Next.js, Convex, TypeScript, API integrations, debugging, code review. Tags memory with "technical".

### Quill — Content Writer
> Scripts, blog posts, social copy, SEO. Moves content cards through the pipeline. Tags memory with "content".

### Prism — UI/UX Designer
> Component design, visual direction, design system. Tags memory with "design".

### Ledger — Data Analyst
> Financial modeling, SEO metrics, business intelligence. Tags memory with "analytics".

### Beacon — Marketing Strategist
> Campaign planning, distribution, audience analysis, brand. Tags memory with "marketing".

### Forge — DevOps / Infrastructure
> Servers, domains, cron jobs, CI/CD. Creates calendar entries for all automations. Tags memory with "infrastructure".

### Glitch — Debugging Specialist
> Error diagnosis, root cause analysis, fix implementation. Tags memory with "debugging".

---

## Quick Reference: Common Operations

**Create a task assigned to Axiom:**
```json
POST /api/tasks/create
{
  "title": "Implement user auth",
  "status": "todo",
  "assignee": "agent",
  "agentId": "Axiom",
  "priority": "high"
}
```

**Log a memory from Quill:**
```json
POST /api/memory/create
{
  "title": "Content strategy Q1",
  "content": "Focus on technical tutorials...",
  "tags": ["content", "strategy"],
  "agentId": "Quill"
}
```

**Schedule a cron job:**
```json
POST /api/calendar/create
{
  "title": "Daily SEO audit",
  "type": "cron_job",
  "agentId": "Ledger",
  "startTime": 1708300800000,
  "recurrence": "Daily at 9am"
}
```

**Move content to script stage:**
```json
POST /api/content/update
{
  "id": "<content-id>",
  "stage": "script",
  "script": "Full script text here...",
  "assignedAgentId": "Quill"
}
```

**Mark agent as active:**
```json
POST /api/agents/status
{
  "id": "<agent-document-id>",
  "status": "active",
  "currentTask": "Writing blog post"
}
```
