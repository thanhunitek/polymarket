// Type definitions for Polymarket APIs

// Gamma API Types
export interface GammaEvent {
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

export interface Market {
  id: string;
  question: string; // Contains the market question with goal line info
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
  gameStartTime: string; // Added gameStartTime field to Market interface
}

export interface Series {
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

export interface Tag {
  id: string;
  label: string;
  slug: string;
  forceShow: boolean;
  updatedAt: string;
  requiresTranslation: boolean;
}

// CLOB API Types
export interface PriceHistoryPoint {
  t: number; // timestamp
  p: number; // price
}

export interface PriceHistoryResponse {
  history: PriceHistoryPoint[];
}

// Filtered Market Types
export interface FilteredMarket {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  eventStartDate: string;
  eventCreationDate: string;
  marketId: string;
  marketQuestion: string;
  marketSlug: string;
  overTokenId: string;
  underTokenId: string;
  currentOverPrice: number;
  currentUnderPrice: number;
  bestAskOverPrice: number | null;
  bestAskUnderPrice: number | null;
  bestAskOverVolume: number | null;
  bestAskUnderVolume: number | null;
  line: number; // Always 4.5 for our filtered markets
  gameStartTime: string; // Added game start time field
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: number;
}
