"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";
import { Drawer as VaulHeader } from "vaul";
import { MenuIcon } from "lucide-react";

const NAV_ITEMS = [
  { href: "/tasks", label: "TASKS", icon: TasksIcon, accent: "#007AFF" },
  { href: "/memory", label: "MEMORY", icon: MemoryIcon, accent: "#AF52DE" },
  { href: "/team", label: "TEAM", icon: TeamIcon, accent: "#34C759" },
  { href: "/calendar", label: "CALENDAR", icon: CalendarIcon, accent: "#FF9500" },
  { href: "/content", label: "CONTENT", icon: ContentIcon, accent: "#FF3B30" },
  { href: "/office", label: "OFFICE", icon: OfficeIcon, accent: "#007AFF" },
];

interface DrawerContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };
    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {/* Fixed top bar — visible on all pages except homepage */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-all hover:opacity-80">
          <div
            className="w-2.5 h-2.5 rounded-full animate-status-pulse"
            style={{ background: "var(--accent-success)", boxShadow: "0 0 10px var(--accent-success)" }}
          />
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Mission Ctrl
          </span>
        </Link>

        {/* Hamburger trigger */}
        <VaulHeader.Root
          open={open}
          direction="top"
          onOpenChange={setOpen}
          dismissible={!isDesktop}
        >
          <VaulHeader.Trigger asChild>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] transition-all cursor-pointer"
              style={{
                background: open ? "var(--glass-bg-hover)" : "transparent",
                border: "1px solid var(--glass-border)",
                color: "var(--text-muted)",
              }}
            >
              <MenuIcon size={18} />
            </button>
          </VaulHeader.Trigger>

          <VaulHeader.Portal>
            <VaulHeader.Overlay
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0, 0, 0, 0.15)", backdropFilter: "blur(4px)" }}
            />
            <VaulHeader.Content
              className="fixed top-0 left-0 right-0 z-50 w-full"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(24px) saturate(1.8)",
                WebkitBackdropFilter: "blur(24px) saturate(1.8)",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <VaulHeader.Title className="sr-only">Navigation</VaulHeader.Title>
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--glass-border)" }}
              >
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-status-pulse"
                    style={{ background: "var(--accent-success)", boxShadow: "0 0 10px var(--accent-success)" }}
                  />
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Mission Control
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] cursor-pointer transition-all hover:bg-[var(--glass-bg-hover)]"
                  style={{ color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}
                >
                  &times;
                </button>
              </div>

              {/* Nav items — centered grid */}
              <nav className="flex flex-col items-center gap-1 px-5 py-4">
                <div className="w-full max-w-lg grid grid-cols-2 md:grid-cols-3 gap-2">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] transition-all"
                        style={{
                          background: isActive ? "var(--glass-bg-hover)" : "var(--glass-bg)",
                          border: isActive
                            ? `1px solid ${item.accent}30`
                            : "1px solid var(--glass-border)",
                          boxShadow: isActive ? `0 0 15px ${item.accent}10` : "none",
                        }}
                      >
                        <item.icon color={isActive ? item.accent : "var(--text-muted)"} />
                        <span
                          className="text-[11px] font-bold tracking-[0.15em]"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          {item.label}
                        </span>
                        {isActive && (
                          <div
                            className="ml-auto w-1.5 h-1.5 rounded-full animate-status-pulse"
                            style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Status footer */}
              <div className="px-5 py-3 flex justify-center" style={{ borderTop: "1px solid var(--glass-border)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--accent-success)", boxShadow: "0 0 6px var(--accent-success)" }}
                  />
                  <span
                    className="text-[10px] tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
                  >
                    v0.1 Online
                  </span>
                </div>
              </div>
            </VaulHeader.Content>
          </VaulHeader.Portal>
        </VaulHeader.Root>
      </header>
    </DrawerContext.Provider>
  );
}

function TasksIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function MemoryIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill={color} />
      <path d="M8 1.5V4M8 12v2.5M1.5 8H4M12 8h2.5" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function TeamIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M1.5 6.5h13" stroke={color} strokeWidth="1.5" />
      <path d="M5 1v3M11 1v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ContentIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M6 5.5l4 2.5-4 2.5V5.5z" fill={color} />
    </svg>
  );
}

function OfficeIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="8" rx="1" stroke={color} strokeWidth="1.5" />
      <path d="M6 11v2.5M10 11v2.5M4 13.5h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
