# API Discovery Documentation

## Gamma API (`https://gamma-api.polymarket.com/events`)

### Data Structure Overview

The Gamma API returns an array of event objects with the following key structure:

```typescript
interface GammaEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  resolutionSource: string;
  startDate: string; // ISO date string
  creationDate: string; // ISO date string
  endDate: string; // ISO date string
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  sortBy: string;
  category: string;
  published_at: string;
  createdAt: string;
  updatedAt: string;
  competitive: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  liquidityAmm: number;
  liquidityClob: number;
  commentCount: number;
  
  // Nested arrays
  markets: Market[];
  series: Series[];
  tags: Tag[];
  
  // Additional fields
  cyom: boolean;
  closedTime: string;
  showAllOutcomes: boolean;
  showMarketImages: boolean;
  enableNegRisk: boolean;
  seriesSlug: string;
  negRiskAugmented: boolean;
  pendingDeployment: boolean;
  deploying: boolean;
  requiresTranslation: boolean;
}

interface Market {
  id: string;
  question: string; // CRITICAL: Contains the market question with goal line info
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  category: string;
  liquidity: string;
  startDate: string;
  fee: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string; // JSON string array e.g., '["Yes", "No"]'
  outcomePrices: string; // JSON string array of prices
  volume: string;
  active: boolean;
  marketType: string;
  closed: boolean;
  marketMakerAddress: string;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  closedTime: string;
  wideFormat: boolean;
  new: boolean;
  sentDiscord: boolean;
  featured: boolean;
  submitted_by: string;
  twitterCardLocation: string;
  twitterCardLastRefreshed: string;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  hasReviewedDates: boolean;
  readyForCron: boolean;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  clobTokenIds: string; // JSON string array - CRITICAL: Token IDs for price history
  fpmmLive: boolean;
  volume1wkAmm: number;
  volume1moAmm: number;
  volume1yrAmm: number;
  volume1wkClob: number;
  volume1moClob: number;
  volume1yrClob: number;
  creator: string;
  ready: boolean;
  funded: boolean;
  cyom: boolean;
  competitive: number;
  pagerDutyNotificationEnabled: boolean;
  approved: boolean;
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  oneYearPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  clearBookOnStart: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  umaResolutionStatuses: string;
  pendingDeployment: boolean;
  deploying: boolean;
  rfqEnabled: boolean;
  holdingRewardsEnabled: boolean;
  feesEnabled: boolean;
  requiresTranslation: boolean;
}

interface Series {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  seriesType: string;
  recurrence: string;
  image?: string;
  icon?: string;
  description?: string;
  layout: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  publishedAt: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commentsEnabled: boolean;
  competitive: string;
  volume24hr: number;
  startDate: string;
  commentCount: number;
  requiresTranslation: boolean;
}

interface Tag {
  id: string;
  label: string;
  slug: string;
  forceShow: boolean;
  updatedAt: string;
  requiresTranslation: boolean;
}
```

### Key Findings for Premier League Markets

1. **Tag-based Filtering**: EPL events are identified by `tag_id: "82"`
2. **Event Types**: EPL matches appear as two types of events:
   - Basic match events (e.g., "Liverpool FC vs. Newcastle United FC")
   - "More Markets" events (e.g., "Liverpool FC vs. Newcastle United FC - More Markets")
3. **Market Structure**: The 4.5 Over/Under markets are nested within "More Markets" events
4. **Market Questions**: The `market.question` field contains the full question text with goal line info
5. **Token IDs**: Each market has `clobTokenIds` array with token IDs for price history

### Example Market Questions for Sports
- "EPL: Will Liverpool FC beat Newcastle United FC by more than 1.5 goals in their December 4 matchup?"
- "EPL: Will Manchester City and Arsenal have a combined total of over 2.5 goals in their match?"
- "EPL: Will the total goals in the match between Chelsea and Tottenham be over or under 4.5?"

### Correct API Parameters for EPL Discovery
To properly discover EPL markets, we must use the Gamma API with specific parameters:

```
GET https://gamma-api.polymarket.com/events
params = {
    "tag_id": "82",
    "closed": "false",
    "limit": 100,
    "offset": 0
}
```

### Identifying 4.5 Over/Under Markets in EPL
The 4.5 Over or Under score markets are nested within "More Markets" events. To find these markets:

1. **API Request**: Use the parameters above to fetch EPL events
2. **Event Identification**: Look for events with titles ending in "- More Markets"
3. **Market Filtering**: Within these events, find markets with questions containing "total goals" and "4.5"
4. **Token Extraction**: Extract `clobTokenIds` for price history retrieval

### Example EPL Market Structure
```
Event: "Liverpool FC vs. Newcastle United FC - More Markets"
  └── Market: "EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 4.5?"
      └── clobTokenIds: ["token1_id", "token2_id"]  // Over and Under token IDs
```

## CLOB API (`https://clob.polymarket.com/prices-history`)

### Correct Parameters (Based on curl example)
The CLOB API requires the following parameters:
- `market`: Token ID from `clobTokenIds` array (this is the asset/market identifier)
- `startTs`: Unix timestamp for start time (should use event creation time)
- `fidelity`: Data point density in seconds (e.g., 60 for 1-minute intervals)

### Example CURL Request
```bash
curl 'https://clob.polymarket.com/prices-history?startTs=1768716110&market=74006651532972825037234110865226653639322418449976716216152926542127385791421&fidelity=60' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Referer: https://polymarket.com/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \
  -H 'sec-ch-ua-mobile: ?0'
```

### Response Structure
```typescript
interface PriceHistoryResponse {
  history: Array<{
    t: number; // Unix timestamp
    p: number; // Price at that timestamp
  }>;
}
```

### Implementation Notes
1. **`startTs` parameter**: Should be derived from event `creationDate` or `startDate` converted to Unix timestamp
2. **`market` parameter**: Use token IDs from `clobTokenIds` array (first token is Over, second is Under)
3. **`fidelity` parameter**: Controls data point density (60 seconds = 1-minute intervals)
4. **Headers**: Important to include proper headers to avoid CORS/blocking issues

### Sample Response
```json
{
  "history": [
    {"t": 1768719617, "p": 0.5},
    {"t": 1768723245, "p": 0.5},
    {"t": 1768726820, "p": 0.5},
    {"t": 1768730417, "p": 0.5},
    {"t": 1768734020, "p": 0.5}
  ]
}
```

## Sample Data Files Created
- Raw Gamma API response sample (first 10 events)
- CLOB API response sample with correct parameters

## Implementation Notes
1. **API Parameters**: Always use `tag_id: "82"` for EPL events
2. **Event Filtering**: Focus on events with titles ending in "- More Markets"
3. **Market Identification**: Look for markets with questions containing "total goals" and "4.5"
4. **Token Extraction**: Extract both token IDs from `clobTokenIds` for Over/Under positions
5. **Error Handling**: Both APIs need proper error handling and rate limiting consideration
6. **Caching**: Consider caching strategies for API responses
