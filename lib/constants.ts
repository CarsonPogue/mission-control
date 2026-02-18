export const TASK_STATUSES = ["todo", "in_progress", "blocked", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "#007AFF",
  in_progress: "#FF9500",
  blocked: "#FF3B30",
  done: "#34C759",
};

export const PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "#8e8e93",
  medium: "#FF9500",
  high: "#FF6B00",
  critical: "#FF3B30",
};

export const CONTENT_STAGES = [
  "idea",
  "script",
  "thumbnail",
  "filming",
  "editing",
  "published",
] as const;
export type ContentStage = (typeof CONTENT_STAGES)[number];

export const CONTENT_STAGE_LABELS: Record<ContentStage, string> = {
  idea: "Idea",
  script: "Script",
  thumbnail: "Thumbnail",
  filming: "Filming",
  editing: "Editing",
  published: "Published",
};

export const EVENT_TYPES = [
  "scheduled_task",
  "cron_job",
  "meeting",
  "reminder",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  scheduled_task: "#007AFF",
  cron_job: "#AF52DE",
  meeting: "#34C759",
  reminder: "#FF9500",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  scheduled_task: "Scheduled Task",
  cron_job: "Cron Job",
  meeting: "Meeting",
  reminder: "Reminder",
};

export const AGENT_STATUS_COLORS: Record<string, string> = {
  active: "#34C759",
  idle: "#FF9500",
  offline: "#8e8e93",
};

export const AGENT_ROLE_COLORS: Record<string, string> = {
  "Primary Orchestrator": "#007AFF",
  "Full-Stack Developer": "#34C759",
  "Content Writer": "#FF9500",
  "UI/UX Designer": "#AF52DE",
  "Data Analyst": "#FF6B00",
  "Marketing Strategist": "#FF3B30",
  "DevOps / Infrastructure": "#8e8e93",
  "Debugging Specialist": "#FF453A",
};
