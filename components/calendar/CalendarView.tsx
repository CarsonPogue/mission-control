"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/ui/LoadingState";
import { GlassCard } from "@/components/ui/glass-card";
import EventModal from "./EventModal";
import EventDetail from "./EventDetail";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "@/lib/constants";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarView() {
  const events = useQuery(api.calendar.list);
  const [view, setView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Doc<"calendarEvents"> | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  if (events === undefined) return <LoadingState label="Loading calendar..." />;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "month") {
      d.setMonth(d.getMonth() + dir);
    } else {
      d.setDate(d.getDate() + dir * 7);
    }
    setCurrentDate(d);
  };

  const getEventsForDate = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return events.filter(
      (e) => e.startTime >= start.getTime() && e.startTime <= end.getTime()
    );
  };

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px]" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isTodayDate = isToday(date);

      cells.push(
        <div
          key={day}
          className="min-h-[80px] md:min-h-[100px] p-1.5 rounded-[var(--radius-sm)] transition-all"
          style={{
            background: isTodayDate ? "var(--glass-bg-hover)" : "transparent",
            border: isTodayDate ? "1px solid var(--accent-primary)" : "1px solid var(--glass-border)",
            boxShadow: isTodayDate ? "0 0 15px rgba(79,142,247,0.1)" : "none",
          }}
        >
          <div
            className="text-xs font-bold mb-1"
            style={{
              fontFamily: "var(--font-display)",
              color: isTodayDate ? "var(--accent-primary)" : "var(--text-muted)",
              textShadow: isTodayDate ? "0 0 8px rgba(79,142,247,0.3)" : "none",
            }}
          >
            {day}
          </div>
          <div className="flex flex-col gap-0.5">
            {dayEvents.slice(0, 3).map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  setSelectedEvent(event);
                  setDetailOpen(true);
                }}
                className="text-left w-full px-1.5 py-0.5 rounded text-[9px] truncate cursor-pointer transition-all hover:brightness-125"
                style={{
                  background: `${EVENT_TYPE_COLORS[event.type]}15`,
                  color: EVENT_TYPE_COLORS[event.type],
                  fontFamily: "var(--font-code)",
                  border: `1px solid ${EVENT_TYPE_COLORS[event.type]}20`,
                }}
              >
                {event.title}
              </button>
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[9px] pl-1" style={{ color: "var(--text-muted)" }}>
                +{dayEvents.length - 3} more
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <GlassCard glowEffect={false} className="p-3">
        <div className="grid grid-cols-7 gap-px mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] py-2 font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{cells}</div>
      </GlassCard>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <GlassCard glowEffect={false} className="p-3 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px mb-1">
            <div />
            {weekDays.map((d) => (
              <div
                key={d.toISOString()}
                className="text-center py-2 rounded-[var(--radius-sm)]"
                style={{
                  background: isToday(d) ? "var(--glass-bg-hover)" : "transparent",
                  border: isToday(d) ? "1px solid var(--accent-primary)" : "none",
                }}
              >
                <div className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                  {DAYS[d.getDay()]}
                </div>
                <div
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: isToday(d) ? "var(--accent-primary)" : "var(--text-primary)",
                  }}
                >
                  {d.getDate()}
                </div>
              </div>
            ))}
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-px" style={{ minHeight: "40px" }}>
                <div className="text-[10px] text-right pr-2 pt-1" style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}>
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>
                {weekDays.map((d) => {
                  const cellEvents = getEventsForDate(d).filter((e) => new Date(e.startTime).getHours() === hour);
                  return (
                    <div key={d.toISOString()} className="border-t" style={{ borderColor: "var(--glass-border)" }}>
                      {cellEvents.map((event) => (
                        <button
                          key={event._id}
                          onClick={() => { setSelectedEvent(event); setDetailOpen(true); }}
                          className="w-full text-left px-1.5 py-1 rounded text-[9px] truncate cursor-pointer mb-0.5 transition-all hover:brightness-125"
                          style={{
                            background: `${EVENT_TYPE_COLORS[event.type]}15`,
                            color: EVENT_TYPE_COLORS[event.type],
                            fontFamily: "var(--font-code)",
                            border: `1px solid ${EVENT_TYPE_COLORS[event.type]}20`,
                          }}
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <div>
      {/* Controls */}
      <GlassCard glowEffect={false} className="flex items-center justify-between gap-3 mb-5 flex-wrap px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>&larr;</Button>
          <h2 className="text-sm font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            {view === "month"
              ? `${MONTHS[month]} ${year}`
              : `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </h2>
          <Button variant="ghost" onClick={() => navigate(1)}>&rarr;</Button>
          <Button variant="ghost" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(val) => setView(val as "month" | "week")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setCreateOpen(true)}>+ Add Event</Button>
        </div>
      </GlassCard>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {(Object.entries(EVENT_TYPE_COLORS) as [string, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}50` }} />
            <span className="text-[10px] tracking-wider uppercase" style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}>
              {EVENT_TYPE_LABELS[type as keyof typeof EVENT_TYPE_LABELS]}
            </span>
          </div>
        ))}
      </div>

      {view === "month" ? renderMonthView() : renderWeekView()}

      <EventModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EventDetail open={detailOpen} onClose={() => setDetailOpen(false)} event={selectedEvent} />
    </div>
  );
}
