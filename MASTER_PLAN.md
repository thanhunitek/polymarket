# MASTER_PLAN.md - Polymarket Premier League Over/Under 4.5 Goals Dashboard

## Project Overview

A Next.js web application that displays Polymarket's Premier League 'Over/Under 4.5 Goals' betting markets with historical price charting capabilities.

---

## Phase 1: Setup & API Discovery

### Objectives
- Initialize the Next.js 15 project with TypeScript and Tailwind CSS
- Explore and document the Polymarket APIs
- Understand the data structures returned by the APIs

### Tasks

#### 1.1 Project Initialization
- [ ] Create Next.js 15 project with TypeScript template
- [ ] Configure Tailwind CSS
- [ ] Set up project folder structure
- [ ] Install required dependencies (Recharts, etc.)

#### 1.2 API Discovery - Gamma API
- [ ] Explore `https://gamma-api.polymarket.com/events` endpoint
- [ ] Document the event data structure
- [ ] Identify how Premier League matches are categorized/tagged
- [ ] Understand the relationship between events, markets, and tokens
- [ ] Document the market question format for "Total Goals" markets

#### 1.3 API Discovery - CLOB API
- [ ] Explore `https://clob.polymarket.com/prices-history` endpoint
- [ ] Document required parameters (token ID, interval, fidelity)
- [ ] Understand the price history data structure
- [ ] Test API responses with sample token IDs

#### 1.4 Deliverables
- [ ] Working Next.js 15 project skeleton
- [ ] API documentation notes
- [ ] Sample API response files for reference

---

## Phase 2: Data Fetching Logic

### Objectives
- Implement robust data fetching from Polymarket APIs
- Create filtering logic for 4.5 goal line markets
- Handle API errors and edge cases

### Tasks

#### 2.1 Types & Interfaces
- [ ] Define TypeScript interfaces for Gamma API events
- [ ] Define TypeScript interfaces for markets and tokens
- [ ] Define TypeScript interfaces for CLOB price history
- [ ] Create utility types for filtered data

#### 2.2 Gamma API Integration
- [ ] Create API service module for Gamma API
- [ ] Implement function to fetch all Premier League events
- [ ] Handle pagination if applicable
- [ ] Implement caching strategy (if needed)

#### 2.3 Filtering Logic (CRITICAL)
- [ ] Implement strict filter for "Total Goals" in market question
- [ ] Implement strict filter for "4.5" goal line
- [ ] Extract relevant token IDs for Over/Under positions
- [ ] Create helper functions for data transformation

#### 2.4 CLOB API Integration
- [ ] Create API service module for CLOB API
- [ ] Implement function to fetch price history by token ID
- [ ] Handle different time intervals (1h, 24h, 7d, etc.)
- [ ] Transform data for Recharts compatibility

#### 2.5 Deliverables
- [ ] Complete TypeScript type definitions
- [ ] Working API service modules
- [ ] Tested filtering logic with strict 4.5 line enforcement

---

## Phase 3: Dashboard UI

### Objectives
- Build the main dashboard displaying filtered matches
- Create responsive and accessible UI components
- Implement match selection functionality

### Tasks

#### 3.1 Layout Components
- [ ] Create main layout with header and navigation
- [ ] Design responsive container structure
- [ ] Implement loading states and skeletons

#### 3.2 Match List Component
- [ ] Create match card component displaying:
  - Team names
  - Match date/time
  - Current Over/Under prices
  - Market status (open/closed)
- [ ] Implement grid/list view for matches
- [ ] Add sorting options (by date, by price, etc.)

#### 3.3 State Management
- [ ] Set up data fetching with React hooks or Server Components
- [ ] Implement selected match state
- [ ] Handle loading and error states

#### 3.4 Styling
- [ ] Apply Tailwind CSS styling
- [ ] Ensure mobile responsiveness
- [ ] Add hover and interaction states

#### 3.5 Deliverables
- [ ] Functional dashboard listing all 4.5 goal line markets
- [ ] Clickable match cards
- [ ] Responsive design across devices

---

## Phase 4: Historical Charting

### Objectives
- Integrate Recharts for price history visualization
- Create interactive chart component
- Display historical data on match selection

### Tasks

#### 4.1 Chart Component
- [x] Install and configure Recharts
- [x] Create price history line chart component
- [x] Display both Over and Under price lines
- [x] Add chart legend and tooltips

#### 4.2 Chart Features
- [x] Implement time range selector (1h, 24h, 7d, 30d)
- [x] Add price axis formatting (percentage display)
- [x] Implement responsive chart sizing
- [x] Add loading state for chart data

#### 4.3 Integration
- [x] Connect chart to match selection
- [x] Fetch price history on match click
- [x] Handle cases with no/limited price history
- [x] Display current price alongside historical

#### 4.4 Deliverables
- [x] Interactive Recharts price history visualization
- [x] Time range selection functionality
- [x] Smooth integration with dashboard

---

## Phase 5: Polish & Production Ready

### Objectives
- Refine UI/UX
- Optimize performance
- Prepare for deployment

### Tasks

#### 5.1 UI Polish
- [ ] Add animations and transitions
- [ ] Improve empty states and error messages
- [ ] Add favicon and meta tags
- [ ] Implement dark/light mode (optional)

#### 5.2 Performance Optimization
- [ ] Implement data caching strategies
- [ ] Optimize re-renders
- [ ] Add request debouncing where needed
- [ ] Lazy load chart component

#### 5.3 Error Handling
- [ ] Add comprehensive error boundaries
- [ ] Implement retry logic for failed requests
- [ ] Add user-friendly error messages

#### 5.4 Testing & Documentation
- [ ] Write component tests (optional)
- [ ] Document API usage
- [ ] Create README with setup instructions

#### 5.5 Deployment Preparation
- [ ] Configure environment variables
- [ ] Set up build optimization
- [ ] Test production build
- [ ] Deploy to Vercel (recommended)

#### 5.6 Deliverables
- [ ] Production-ready application
- [ ] Comprehensive documentation
- [ ] Deployed and accessible web app

---

## API Reference

### Gamma API
- **Base URL**: `https://gamma-api.polymarket.com`
- **Events Endpoint**: `/events`
- **Purpose**: Fetch Premier League match events and markets

### CLOB API
- **Base URL**: `https://clob.polymarket.com`
- **Price History Endpoint**: `/prices-history`
- **Parameters**: `tokenId`, `interval`, `fidelity`
- **Purpose**: Fetch historical price data for charting

---

## Success Criteria

1. ✅ Dashboard displays ONLY Premier League matches with 4.5 goal line markets
2. ✅ Strict filtering ensures no other goal lines (2.5, 3.5, etc.) appear
3. ✅ Clicking a match shows historical price chart
4. ✅ Chart displays both Over and Under price movements
5. ✅ Application is responsive and performant
6. ✅ TypeScript provides full type safety
