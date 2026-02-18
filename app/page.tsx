"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

const NAV_ITEMS = [
  {
    name: "Tasks Board",
    href: "/tasks",
    accent: "#007AFF",
    desc: "Kanban task management",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="14" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Memory Log",
    href: "/memory",
    accent: "#AF52DE",
    desc: "Knowledge persistence",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    name: "Team",
    href: "/team",
    accent: "#34C759",
    desc: "Agent roster & status",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 21c0-3.87 3.58-7 8-7s8 3.13 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Calendar",
    href: "/calendar",
    accent: "#FF9500",
    desc: "Schedule & cron jobs",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Content",
    href: "/content",
    accent: "#FF3B30",
    desc: "Production pipeline",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8l6 4-6 4V8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Office",
    href: "/office",
    accent: "#007AFF",
    desc: "Digital workstations",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16v3M16 16v3M6 19h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const agents = useQuery(api.agents.list);
  const seedAgents = useMutation(api.agents.seed);

  useEffect(() => {
    if (agents && agents.length === 0) {
      seedAgents();
    }
  }, [agents, seedAgents]);

  const activeCount = agents?.filter((a) => a.status === "active").length ?? 0;
  const totalCount = agents?.length ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-8 animate-fade-in-up -mt-[60px]">
      {/* Mission Control Hero */}
      <div className="relative w-full max-w-[560px] mb-10">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl px-8 py-12 flex flex-col items-center text-center transition-all duration-300 hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-md)]">
          <PixelCanvas
            gap={5}
            speed={30}
            colors={["#007AFF40", "#34C75930", "#AF52DE30"]}
            noFocus
          />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div
              className="w-3 h-3 rounded-full animate-status-pulse"
              style={{ background: "var(--accent-success)", boxShadow: "0 0 8px var(--accent-success)" }}
            />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
            >
              {activeCount}/{totalCount} agents online
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight relative z-10"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            MISSION CONTROL
          </h1>
          <p
            className="mt-2 text-[13px] tracking-wide relative z-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Personal command center. All systems nominal.
          </p>
        </div>
      </div>

      {/* Navigation Grid — 3x2 with PixelCanvas hover */}
      <div className="w-full max-w-[740px] grid grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <div
              className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl px-6 py-7 flex flex-col items-center text-center h-full transition-all duration-300 hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <PixelCanvas
                gap={6}
                speed={25}
                colors={[item.accent + "40", item.accent + "20", item.accent + "60"]}
                noFocus
              />
              <div
                className="mb-3 relative z-10"
                style={{ color: item.accent }}
              >
                {item.icon}
              </div>
              <div
                className="text-sm font-bold tracking-[0.15em] uppercase mb-1 relative z-10"
                style={{ fontFamily: "var(--font-display)", color: item.accent }}
              >
                {item.name}
              </div>
              <div
                className="text-xs leading-relaxed relative z-10"
                style={{ color: "var(--text-muted)" }}
              >
                {item.desc}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="mt-8 text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
        style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--accent-success)", boxShadow: "0 0 6px var(--accent-success)" }}
        />
        v0.1 — All systems operational
      </div>
    </div>
  );
}
