# Under 4.5 Trading Strategy — Edge Verification & Decision Support

## Strategy Thesis
EPL matches rarely exceed 4.5 total goals (~85-88% Under in a normal season, ~78% even in the record-high 2023-24). Buying Under 4.5 at <75¢ on Polymarket is +EV because the breakeven is 75%, well below the historical floor.

## The Problem
The current dashboard shows prices but gives **zero information about whether a specific market is actually a good buy**. A generic 75¢ threshold ignores that:
- Bournemouth matches go Over 4.5 **35%** of the time (Under = 65% → buying at 75¢ is **-EV**)
- Chelsea matches go Over 4.5 only **4%** of the time (Under = 96% → buying at 75¢ is massively **+EV**)
- The same price means completely different things depending on which teams are playing

---

## Phase 1: Team-Level Edge Calculator (Current Scope)

**Goal:** For each market card, show the **true probability** of Under 4.5 based on the specific teams playing, and compare it to the asking price to show whether there's a real edge.

### 1A. Team Stats Data Source
- Over 4.5 goal rates per EPL team for 2024-25 and current 2025-26 season
- Store as a static typed lookup: `{ "Arsenal": { over45Pct: 22, matchesPlayed: 23, season: "2024-25" }, ... }`
- **New file:** `data/team-stats.ts`
- **Source:** SoccerStats.com / FootyStats.org (hardcoded initially, updated manually each gameweek)

### 1B. Extract Team Names from Market Data
- Parse `eventTitle` (e.g. "Arsenal vs Chelsea - More Markets") to extract home and away team names
- Handle variations: "Man City" / "Manchester City", "Spurs" / "Tottenham", etc.
- **New file:** `lib/team-parser.ts`

### 1C. Estimate True Probability of Under 4.5
- Simple model: `matchOver45Pct = (teamA_over45Pct + teamB_over45Pct) / 2`
- `trueUnderProbability = 1 - matchOver45Pct / 100`
- `edge = trueUnderProbability - askPrice`
- `ev = edge` (per $1 wagered)
- **New file:** `lib/edge-calculator.ts`

### 1D. Display Edge on Each Card
- Show on each match card:
  - **True Under %** (e.g. "~91% based on team stats")
  - **Asking price** (e.g. "75%")
  - **Edge** = True % - Ask % (e.g. "+16%" in green, or "-3%" in red)
  - **EV per $1** = edge as dollar amount (e.g. "+$0.16")
- Color-code: green if +EV, red if -EV
- **File:** `components/features/match-card.tsx` — add edge display section
- **File:** `types/index.ts` — extend FilteredMarket with `homeTeam`, `awayTeam`, `trueUnderPct`, `edge`

### 1E. Team Match History View (Per-Team Goal Breakdown)
- When user clicks a team name on a card, open a panel/modal showing that team's **every match this season** with scores and total goals
- Data source: **openfootball/football.json** — free static JSON, no API key, no rate limits
  - `https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/en.1.json`
  - `https://raw.githubusercontent.com/openfootball/football.json/master/2025-26/en.1.json`
- Fetch both seasons, cache in state, filter by team name
- Display as a table:
  - **Date** | **Match** | **Score** | **Total Goals** | **Over 4.5?**
  - Highlight rows where total > 4.5 in red
  - Show summary row: "X/Y matches Over 4.5 (Z%)"
- Also show **last 5 matches** mini-trend on the card itself (e.g. `2 3 1 4 6` with 6 highlighted red)
- This replaces the static `data/team-stats.ts` hardcoded lookup — the Over 4.5 % is now **computed live from real match data**
- **New file:** `services/match-history.ts` — fetch + parse openfootball JSON, filter by team, compute stats
- **New file:** `components/features/team-history.tsx` — table view of team's match history
- **New file:** `app/api/match-history/route.ts` — proxy to avoid CORS issues with GitHub raw URLs
- **File:** `types/index.ts` — add `MatchResult`, `TeamMatchHistory` interfaces
- **File:** `components/features/match-card.tsx` — clickable team names, last-5 trend display
- **File:** `app/client-page.tsx` — fetch match history data, manage team history modal state

**Impact on 1A:** `data/team-stats.ts` is no longer a manually updated file — instead, team stats are **derived from real match data** fetched in 1E. The edge calculator (1C) reads computed stats from the match history service.

### Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `services/match-history.ts` | New | Fetch openfootball JSON, parse, compute per-team Over 4.5 stats |
| `app/api/match-history/route.ts` | New | Proxy for GitHub raw URLs (CORS) |
| `lib/team-parser.ts` | New | Extract team names from event title, handle name variations |
| `lib/edge-calculator.ts` | New | Compute true probability, edge, EV from live team stats |
| `components/features/team-history.tsx` | New | Table view: team's match-by-match scores + Over 4.5 highlight |
| `types/index.ts` | Modify | Add MatchResult, TeamMatchHistory, edge fields to FilteredMarket |
| `components/features/match-card.tsx` | Modify | Display edge, true %, EV, clickable team names, last-5 trend |
| `app/client-page.tsx` | Modify | Fetch match history, integrate edge calc, team history modal |

### Verification
- `npm run build` passes
- Each card shows true Under %, edge %, and EV — color-coded green/red
- Team names correctly parsed from all current market titles
- Edge calculation matches manual check (e.g. Chelsea match = high edge, Bournemouth = low/negative edge)
- Clicking a team name opens history table with every match + scores
- Rows with total goals > 4.5 highlighted in red
- Summary row shows correct Over 4.5 count and percentage
- Last-5 trend displays on each card with correct goal totals
- Over 4.5 % on cards matches the computed value from real match data (not hardcoded)

---

## Future Phases (Not in Current Scope)

### Phase 2: Historical Validation with Resolved Markets
- Fetch closed EPL 4.5 markets from Gamma API, determine outcomes
- Backtest: "what if we bought every Under 4.5 at <75¢?" → show win rate, ROI, worst streak

### Phase 3: Smart Sorting & Filtering by Edge
- Sort by edge (highest first), filter out -EV markets, minimum edge threshold

### Phase 4: Auto-Refresh & Alerts
- Auto-refresh prices (30s/60s/2m/5m), browser notifications when +EV opportunity appears
