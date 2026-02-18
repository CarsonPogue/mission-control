"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in-up">
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 glass-panel"
        style={{
          borderColor: "rgba(244,63,94,0.3)",
          boxShadow: "0 0 30px rgba(244,63,94,0.1)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="var(--accent-danger)" strokeWidth="1.5" />
          <path d="M14 8v7" stroke="var(--accent-danger)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="19" r="1.2" fill="var(--accent-danger)" />
        </svg>
      </div>
      <h2
        className="text-lg font-bold tracking-[0.1em] uppercase mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--accent-danger)" }}
      >
        System Error
      </h2>
      <p className="text-sm max-w-md mb-6" style={{ color: "var(--text-muted)" }}>
        {error.message || "An unexpected error occurred. The system has logged this incident."}
      </p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
