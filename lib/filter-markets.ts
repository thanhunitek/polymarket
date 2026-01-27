import { Market, FilteredMarket } from '@/types';

/**
 * Strictly filters markets to only include 4.5 Over/Under markets
 * Implements the exact filtering logic required by RULES.MD
 */
export function filter45OverUnderMarkets(markets: Market[]): FilteredMarket[] {
  return markets
    .filter(is45OverUnderMarket)
    .map(market => {
      const outcomePrices = JSON.parse(market.outcomePrices) as [string, string];
      const clobTokenIds = JSON.parse(market.clobTokenIds) as [string, string];
      
      // Determine which token is Over and which is Under
      // Based on typical Polymarket convention: first token is Over, second is Under
      const overTokenId = clobTokenIds[0];
      const underTokenId = clobTokenIds[1];
      const currentOverPrice = parseFloat(outcomePrices[0]);
      const currentUnderPrice = parseFloat(outcomePrices[1]);

      return {
        eventId: '', // Will be populated when we have the event context
        eventSlug: '', // Will be populated when we have the event context
        eventTitle: '', // Will be populated when we have the event context
        eventStartDate: '', // Will be populated when we have the event context
        eventCreationDate: '', // Will be populated when we have the event context
        marketId: market.id,
        marketQuestion: market.question,
        marketSlug: market.slug,
        overTokenId,
        underTokenId,
        currentOverPrice,
        currentUnderPrice,
        bestAskOverPrice: null,
        bestAskUnderPrice: null,
        bestAskOverVolume: null,
        bestAskUnderVolume: null,
        line: 4.5,
        gameStartTime: market.gameStartTime,
      };
    });
}

/**
 * Strictly checks if a market is a 4.5 Over/Under market
 * Implements strict filtering as required by RULES.MD
 */
export function is45OverUnderMarket(market: Market): boolean {
  const question = market.question.toLowerCase();
  
  // Check for "total goals" or "O/U" pattern
  const hasTotalGoals = question.includes('total goals') || question.includes('o/u');
  
  // Strict check for 4.5 - using regex to match exactly 4.5 (not 1.5, 2.5, 3.5, etc.)
  // This is CRITICAL for the project - only 4.5 goal line markets should be included
  const has45Line = /\b4\.5\b/.test(market.question);
  
  // Also check if it's an Over/Under market
  const isOverUnder = question.includes('over') && question.includes('under');
  
  return hasTotalGoals && has45Line && isOverUnder;
}

/**
 * Validates that a market strictly matches the 4.5 goal line requirement
 * This is a more comprehensive validation function that follows RULES.MD exactly
 */
export function validate45GoalLineMarket(market: Market): boolean {
  // Check that the market question contains "total goals" (case insensitive)
  if (!market.question.toLowerCase().includes('total goals')) {
    return false;
  }
  
  // Use strict regex to match exactly 4.5 (not 1.5, 2.5, 3.5, etc.)
  // The \b ensures word boundaries so we don't match "14.5" or "4.51"
  if (!/\b4\.5\b/.test(market.question)) {
    return false;
  }
  
  // Check that it's an Over/Under market
  if (!market.question.toLowerCase().includes('over') || !market.question.toLowerCase().includes('under')) {
    return false;
  }
  
  return true;
}

/**
 * Comprehensive validation for filtering markets
 * This function ensures we're following the strict requirements from RULES.MD
 */
export function validateMarketFiltering(market: Market): boolean {
  // 1. Must contain "total goals" (case insensitive)
  if (!market.question.toLowerCase().includes('total goals')) {
    return false;
  }
  
  // 2. Must have exactly 4.5 goal line (using word boundary regex)
  if (!/\b4\.5\b/.test(market.question)) {
    return false;
  }
  
  // 3. Must be an Over/Under market
  if (!market.question.toLowerCase().includes('over') || !market.question.toLowerCase().includes('under')) {
    return false;
  }
  
  // 4. Must NOT contain other goal lines (2.5, 3.5, 5.5, etc.)
  const questionLower = market.question.toLowerCase();
  const forbiddenLines = ['2.5', '3.5', '5.5', '6.5', '7.5', '8.5', '9.5'];
  for (const line of forbiddenLines) {
    if (questionLower.includes(line)) {
      return false;
    }
  }
  
  return true;
}