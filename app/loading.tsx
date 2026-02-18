export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-10 h-10 mb-4">
        <div
          className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent-primary)", borderTopColor: "transparent" }}
        />
        <div
          className="absolute inset-1.5 rounded-full border border-t-transparent animate-spin"
          style={{
            borderColor: "var(--accent-purple)",
            borderTopColor: "transparent",
            animationDirection: "reverse",
            animationDuration: "1.5s",
          }}
        />
      </div>
      <span
        className="text-[11px] tracking-[0.2em] uppercase animate-status-pulse"
        style={{ fontFamily: "var(--font-code)", color: "var(--text-muted)" }}
      >
        Initializing...
      </span>
    </div>
  );
}
