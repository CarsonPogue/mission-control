"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glowOnFocus?: boolean
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, glowOnFocus = true, ...props }, ref) => {
    return (
      <div className="relative group">
        {glowOnFocus && (
          <div className="absolute -inset-0.5 rounded-xl bg-linear-to-r from-[var(--glow-cyan)]/0 via-[var(--accent-primary)]/0 to-[var(--glow-purple)]/0 blur-md opacity-0 transition-all duration-300 group-focus-within:from-[var(--glow-cyan)] group-focus-within:via-[var(--accent-primary)]/20 group-focus-within:to-[var(--glow-purple)] group-focus-within:opacity-70" />
        )}
        <input
          type={type}
          className={cn(
            "relative flex h-10 w-full rounded-xl px-4 py-2 text-sm",
            "bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]",
            "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "shadow-[var(--shadow-sm)]",
            "transition-all duration-300",
            "focus:outline-none focus:border-[var(--glass-border-hover)] focus:bg-[var(--glass-bg-hover)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
GlassInput.displayName = "GlassInput"

export { GlassInput }
