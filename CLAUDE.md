# Mission Control — Project Instructions

## Skill: UI/UX Master
All design decisions must follow these mandates:
- **BOLD, intentional aesthetic**: Dark, industrial/utilitarian with sharp accent colors (mission control room, not SaaS dashboard)
- **Never** use Inter, Roboto, Arial, or purple gradients as primary design elements
- Use distinctive, characterful fonts: Space Mono (headers), IBM Plex Sans (body), JetBrains Mono (code)
- Use CSS variables for ALL theme tokens
- Animate high-impact moments: page load, state transitions, agent status changes
- Every screen must feel designed with purpose, not generated generically
- Glassmorphism on cards, subtle scanline overlays, CRT glow on active elements
- Priority colors: low=slate, medium=amber, high=orange, critical=red pulsing ring

## Skill: Next.js Expert
All architecture decisions must follow these mandates:
- Next.js 14 App Router conventions strictly
- Proper server/client component boundaries — use `"use client"` only where needed
- Convex for all real-time data (no REST, no polling)
- Type-safe throughout — leverage Convex generated types
- Modular component structure per the project architecture spec
- Loading states, error states, and empty states on every screen
- Mobile responsive: sidebar collapses to bottom nav on mobile

## Skill: Frontend Design
- Choose aesthetic direction BEFORE writing code
- Dark theme only — no light mode
- CSS variables defined in globals.css for the full design system
- Motion: --transition-fast (120ms), --transition-base (200ms), --transition-slow (350ms cubic-bezier)
- Color palette: bg-base (#0a0a0f), bg-surface (#111118), bg-elevated (#1a1a24)
- Accents: primary blue (#4f8ef7), success teal (#2dd4a0), warning amber (#f59e0b), danger rose (#f43f5e), purple (#8b5cf6)

## Stack
- Next.js 14 (App Router) + TypeScript
- Convex (real-time database)
- Tailwind CSS
- @dnd-kit/core (drag and drop)
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
