export default function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 glass-panel"
        style={{
          borderColor: "rgba(244,63,94,0.3)",
          boxShadow: "0 0 20px rgba(244,63,94,0.1)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="var(--accent-danger)" strokeWidth="1.5" />
          <path d="M11 7v5" stroke="var(--accent-danger)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="11" cy="15" r="1" fill="var(--accent-danger)" />
        </svg>
      </div>
      <h3
        className="text-sm font-bold tracking-[0.1em] uppercase mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--accent-danger)" }}
      >
        Error
      </h3>
      <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}
