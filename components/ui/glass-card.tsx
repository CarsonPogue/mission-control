"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowEffect?: boolean
  children: React.ReactNode
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glowEffect = true, children, ...props }, ref) => {
    return (
      <div className="relative">
        {glowEffect && (
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-[var(--glow-cyan)] via-[var(--accent-primary)]/20 to-[var(--glow-purple)] blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
        )}
        <div
          ref={ref}
          className={cn(
            "relative rounded-2xl border",
            "border-[var(--glass-border)]",
            "bg-[var(--glass-bg)] backdrop-blur-xl",
            "shadow-[var(--shadow-md)]",
            "before:absolute before:inset-0 before:rounded-2xl",
            "before:bg-linear-to-b before:from-white/40 before:to-transparent before:pointer-events-none",
            "after:absolute after:inset-px after:rounded-[calc(1rem-1px)]",
            "after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] after:pointer-events-none",
            "transition-all duration-300",
            "hover:border-[var(--glass-border-hover)]",
            "hover:shadow-[var(--shadow-lg)]",
            className,
          )}
          {...props}
        >
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    )
  },
)
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />,
)
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
      {...props}
    />
  ),
)
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm", className)} style={{ color: "var(--text-secondary)" }} {...props} />,
)
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
GlassCardFooter.displayName = "GlassCardFooter"

export { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter }
