# RULES.md - Project Development Rules & Standards

## Technology Stack (MANDATORY)

### Framework & Language
- **Next.js 15** - Use the latest Next.js 15 with App Router
- **TypeScript** - Strict mode enabled, no `any` types allowed
- **Tailwind CSS** - For all styling, no inline styles or CSS modules

### Dependencies
- **Recharts** - For price history charting (no other charting libraries)
- **Native fetch** - Use built-in fetch API for data fetching

---

## Coding Standards

### TypeScript Rules
```typescript
// ✅ CORRECT - Explicit types
interface Market {
  id: string;
  question: string;
  outcomes: Outcome[];
}

// ❌ WRONG - Using any
const data: any = fetchData();
```

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `MatchCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `filterMarkets.ts`)
- Types: `types.ts` or `*.types.ts`
- API services: `*.service.ts`

### Folder Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities and helpers
├── services/              # API service modules
└── types/                 # TypeScript type definitions
```

---

## API Integration Rules

### Gamma API
- **Base URL**: `https://gamma-api.polymarket.com`
- Always handle rate limiting
- Cache responses where appropriate

### CLOB API
- **Base URL**: `https://clob.polymarket.com`
- Always include required parameters for `/prices-history`
- Handle empty/missing data gracefully

---

## ⚠️ CRITICAL: Strict Filtering Rules

### Goal Line Filtering (MANDATORY)

The application MUST only display markets with **exactly 4.5 goal line**. This is non-negotiable.

#### Filtering Implementation

```typescript
// ✅ CORRECT - Strict 4.5 filtering
const isValidMarket = (market: Market): boolean => {
  const question = market.question.toLowerCase();
  
  // Must contain "total goals"
  const hasTotalGoals = question.includes('total goals');
  
  // Must have exactly 4.5 line - use regex for precision
  const has45Line = /\b4\.5\b/.test(question);
  
  return hasTotalGoals && has45Line;
};

// ❌ WRONG - Loose filtering that could match other lines
const isValidMarket = (market: Market): boolean => {
  return market.question.includes('4.5'); // Could match "14.5" or other
};
```

#### Validation Checklist
- [ ] Filter checks for "Total Goals" (case-insensitive)
- [ ] Filter uses word boundary regex for "4.5" (`\b4\.5\b`)
- [ ] Filter excludes 2.5, 3.5, 5.5, and all other goal lines
- [ ] Filter is applied BEFORE rendering any data

#### Prohibited Goal Lines
The following goal lines must NEVER appear in the dashboard:
- 0.5, 1.5, 2.5, 3.5 (under 4.5)
- 5.5, 6.5, 7.5+ (over 4.5)

---

## UI/UX Rules

### Tailwind CSS
- Use Tailwind utility classes exclusively
- Follow mobile-first responsive design
- Use consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64)

### Component Guidelines
- All components must be typed with TypeScript
- Use Server Components by default, Client Components only when needed
- Implement loading and error states for all async operations

### Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Include proper ARIA labels where needed

---

## Data Handling Rules

### State Management
- Use React hooks for local state
- Use Server Components for data fetching when possible
- Avoid prop drilling - use composition patterns

### Error Handling
- All API calls must have try/catch blocks
- Display user-friendly error messages
- Log errors for debugging (console in dev, proper logging in prod)

### Data Transformation
- Transform API data at the service layer
- Keep components focused on rendering
- Create dedicated transformer functions

---

## Performance Rules

### Optimization
- Use `React.memo` for expensive components
- Implement proper loading states (skeletons preferred)
- Lazy load the chart component

### Caching
- Cache API responses appropriately
- Use Next.js built-in caching mechanisms
- Implement stale-while-revalidate patterns

---

## Git & Version Control

### Commit Messages
- Use conventional commits format
- Examples:
  - `feat: add match card component`
  - `fix: correct 4.5 goal line filtering`
  - `refactor: extract API service module`

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring

---

## Testing Guidelines (Optional but Recommended)

### Unit Tests
- Test filtering logic thoroughly
- Test data transformation functions
- Use Jest and React Testing Library

### Test Cases for Filtering
```typescript
describe('filterMarkets', () => {
  it('should include markets with 4.5 total goals', () => {
    // Test implementation
  });
  
  it('should exclude markets with 2.5 total goals', () => {
    // Test implementation
  });
  
  it('should exclude markets with 3.5 total goals', () => {
    // Test implementation
  });
});
```

---

## Summary of Non-Negotiable Rules

| Rule | Requirement |
|------|-------------|
| Framework | Next.js 15 with App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS only |
| Charting | Recharts |
| Goal Line | **ONLY 4.5** - strict regex filtering |
| API | Gamma API for events, CLOB API for price history |
