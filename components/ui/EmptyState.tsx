export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 glass-panel"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            x="2"
            y="2"
            width="18"
            height="18"
            rx="4"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path d="M11 7v8M7 11h8" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3
        className="text-sm font-bold tracking-[0.1em] uppercase mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}
      >
        {title}
      </h3>
      <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
