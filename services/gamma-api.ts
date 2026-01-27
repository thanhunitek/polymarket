import { GammaEvent, FilteredMarket } from '@/types';

// Use local API route to avoid CORS issues
const GAMMA_API_BASE_URL = '/api/gamma';

/**
 * Fetches Premier League events from Gamma API via proxy
 */
export async function fetchPremierLeagueEvents(): Promise<GammaEvent[]> {
  try {
    const response = await fetch(
      GAMMA_API_BASE_URL,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
    }

    const events: GammaEvent[] = await response.json();
    return events;
  } catch (error) {
    console.error('Error fetching Premier League events:', error);
    
    // Provide more specific error information for debugging
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('This is likely a CORS error. The API may not be accessible from this domain.');
      console.error('The proxy API route should resolve this issue.');
    }
    
    throw error;
  }
}

/**
 * Filters all markets from events to find 4.5 goal line markets with correct slug filtering
 * This function implements the specific filtering requirements from the task:
 * 1. Filter events with slug ending with "more-markets"
 * 2. Filter markets with slug ending with "4pt5"
 */
export function filter45GoalLineMarkets(events: GammaEvent[]): FilteredMarket[] {
  const filteredMarkets: FilteredMarket[] = [];

  // Go through all events and filter based on the specific slug requirements
  for (const event of events) {
    // Only process events with slug ending with "more-markets"
    if (!event.slug.endsWith('more-markets')) {
      continue;
    }

    // Process markets in this event
    for (const market of event.markets) {
      // Only include markets with slug ending with "4pt5"
      if (market.slug.endsWith('4pt5')) {
        const outcomePrices = JSON.parse(market.outcomePrices) as [string, string];
        const clobTokenIds = JSON.parse(market.clobTokenIds) as [string, string];
        
        // Determine which token is Over and which is Under
        // Based on typical Polymarket convention: first token is Over, second is Under
        const overTokenId = clobTokenIds[0];
        const underTokenId = clobTokenIds[1];
        const currentOverPrice = parseFloat(outcomePrices[0]);
        const currentUnderPrice = parseFloat(outcomePrices[1]);

        filteredMarkets.push({
          eventId: event.id,
          eventSlug: event.slug,
          eventTitle: event.title,
          eventStartDate: event.startDate,
          eventCreationDate: event.creationDate,
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
          gameStartTime: market.gameStartTime, // Added gameStartTime field
        });
      }
    }
  }

  return filteredMarkets;
}

/**
 * Strictly checks if a market is a 4.5 Over/Under market
 * Implements strict filtering as required by RULES.MD
 */
export function is45OverUnderMarket(market: any): boolean {
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
 * Extracts token IDs from a market for price history fetching
 */
export function extractTokenIds(market: any): { overTokenId: string; underTokenId: string } | null {
  try {
    const clobTokenIds = JSON.parse(market.clobTokenIds) as string[];
    if (clobTokenIds.length >= 2) {
      return {
        overTokenId: clobTokenIds[0],
        underTokenId: clobTokenIds[1],
      };
    }
  } catch (error) {
    console.error('Error parsing clobTokenIds:', error);
  }
  return null;
}

/**
 * Validates that a market strictly matches the 4.5 goal line requirement
 * This is a more comprehensive validation function that follows RULES.MD exactly
 */
export function validate45GoalLineMarket(market: any): boolean {
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