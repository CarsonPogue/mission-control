export default function Badge({
  label,
  color,
  pulse = false,
}: {
  label: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase backdrop-blur-sm ${pulse ? "priority-critical-ring" : ""}`}
      style={{
        fontFamily: "var(--font-display)",
        color,
        background: `${color}12`,
        border: `1px solid ${color}25`,
        boxShadow: pulse ? `0 0 12px ${color}30` : "none",
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pulse ? "animate-status-pulse" : ""}`}
        style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
      />
      {label}
    </span>
  );
}
