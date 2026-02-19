# Mission Control — Project Instructions

## Skill: UI/UX Master
All design decisions must follow these mandates:
- **Clean, intentional macOS aesthetic**: Light theme with white backgrounds, subtle glass effects, and macOS system accent colors
- **Never** use Inter, Roboto, Arial, or purple gradients as primary design elements
- Use distinctive, characterful fonts: Space Mono (headers), IBM Plex Sans (body), JetBrains Mono (code)
- Use CSS variables for ALL theme tokens
- Animate high-impact moments: page load, state transitions, agent status changes
- Every screen must feel designed with purpose, not generated generically
- Glassmorphism on cards with subtle borders and soft shadows
- Priority colors: low=slate, medium=amber, high=orange, critical=red pulsing ring
- macOS system colors: blue (#007AFF), green (#34C759), orange (#FF9500), red (#FF3B30), purple (#AF52DE)

## Skill: Next.js Expert
All architecture decisions must follow these mandates:
- Next.js App Router conventions strictly
- Proper server/client component boundaries — use `"use client"` only where needed
- Convex for all real-time data (no REST, no polling)
- Type-safe throughout — leverage Convex generated types
- Modular component structure per the project architecture spec
- Loading states, error states, and empty states on every screen
- Mobile responsive: sidebar collapses to bottom nav on mobile

## Skill: Frontend Design
- Choose aesthetic direction BEFORE writing code
- Light macOS theme with white backgrounds and subtle glass effects
- CSS variables defined in globals.css for the full design system
- Motion: --transition-fast (120ms), --transition-base (200ms), --transition-slow (350ms cubic-bezier)
- Color palette: bg-base (#ffffff), bg-surface (#f5f5f7), bg-elevated (#ffffff)
- Accents: primary blue (#007AFF), success green (#34C759), warning orange (#FF9500), danger red (#FF3B30), purple (#AF52DE)

## Stack
- Next.js (App Router) + TypeScript
- Convex (real-time database)
- Tailwind CSS v4
- @dnd-kit/core (drag and drop)
- shadcn/ui + einui glass components
- next-themes (light default)
- framer-motion
- Space Mono / IBM Plex Sans / JetBrains Mono (Google Fonts)

## Build Order
1. Project scaffold
2. Convex schema
3. Global layout + sidebar
4. Tasks Board (most foundational)
5. Memory Log
6. Team Structure
7. Calendar
8. Content Pipeline
9. Digital Office
10. Polish pass
