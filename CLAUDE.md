# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Polymarket Premier League Dashboard — displays **4.5 goal line** over/under betting markets for Premier League matches. Built with Next.js (App Router), TypeScript (strict), Tailwind CSS 4, and Recharts.

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
```

No test or lint scripts are configured.

## Architecture

**Data flow:** `page.tsx` (server) → `client-page.tsx` (client) → services → external APIs

### API Layer
- **Gamma API** (`gamma-api.polymarket.com`): Fetches Premier League events. Proxied through `/app/api/gamma/route.ts` to avoid CORS.
- **CLOB API** (`clob.polymarket.com`): Fetches order book data and price history. Called directly from client (has CORS headers).

### Key Directories
- `services/` — API integration (`gamma-api.ts`, `clob-api.ts`)
- `components/features/` — Domain components (match cards, price charts)
- `components/ui/` — Reusable layout/UI components
- `lib/` — Utilities (date formatting with UTC+7, market filtering)
- `types/index.ts` — All TypeScript interfaces

### State Management
All state lives in `client-page.tsx` via React hooks: markets list, selected market, price histories, sort type, loading/error states.

## Critical Rules

- **4.5 goal line only**: Markets must be filtered using word-boundary regex (`/\b4\.5\b/`) and slug checks (`"4pt5"` suffix). Never display other goal lines (2.5, 3.5, 5.5, etc.).
- **No `any` types** — strict TypeScript throughout.
- **Tailwind CSS only** — no inline styles or CSS modules.
- **Recharts only** for charting.
- **Native fetch only** — no axios or other HTTP libraries.
- Use conventional commits (`feat:`, `fix:`, `refactor:`).
- Path alias: `@/*` maps to project root.
