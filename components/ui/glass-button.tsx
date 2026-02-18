"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const glassButtonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl cursor-pointer",
    "text-sm font-medium transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:scale-105 active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]",
          "text-[var(--text-primary)]",
          "shadow-[var(--shadow-sm)]",
          "hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/30 before:to-transparent before:pointer-events-none",
        ),
        primary: cn(
          "bg-[var(--accent-primary)] text-white",
          "shadow-[0_4px_20px_var(--glow-cyan)]",
          "hover:shadow-[0_4px_30px_var(--glow-cyan)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
        ),
        outline: cn(
          "bg-transparent backdrop-blur-sm border-2 border-[var(--glass-border-hover)]",
          "text-[var(--text-primary)]",
          "hover:bg-[var(--glass-bg)] hover:border-[var(--accent-primary)]/30",
        ),
        ghost: cn(
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]",
        ),
        destructive: cn(
          "bg-[var(--accent-danger)]/10 backdrop-blur-xl border border-[var(--accent-danger)]/20",
          "text-[var(--accent-danger)]",
          "shadow-[0_4px_16px_rgba(255,59,48,0.1)]",
          "hover:bg-[var(--accent-danger)]/20 hover:border-[var(--accent-danger)]/30",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
        ),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  glowEffect?: boolean,
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, asChild = false, size, glowEffect = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button'
    return (
      <div className="relative inline-block">
        {glowEffect && (
          <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-[var(--glow-cyan)] via-[var(--accent-primary)]/20 to-[var(--glow-purple)] blur-lg opacity-0 transition-opacity group-hover:opacity-70" />
        )}
        <Comp className={cn(glassButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </Comp>
      </div>
    )
  },
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
