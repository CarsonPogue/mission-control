import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in-up">
      <div
        className="text-6xl font-bold mb-2"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--accent-primary)",
          textShadow: "0 0 20px rgba(79,142,247,0.3)",
        }}
      >
        404
      </div>
      <h2
        className="text-sm font-bold tracking-[0.15em] uppercase mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-secondary)" }}
      >
        Sector Not Found
      </h2>
      <p className="text-xs max-w-xs mb-6" style={{ color: "var(--text-muted)" }}>
        This area of Mission Control does not exist. Return to the command center.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-bold tracking-[0.12em] uppercase rounded-[var(--radius-md)] bg-[var(--accent-primary)] text-white hover:brightness-110 transition-all"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
