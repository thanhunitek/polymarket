import { PriceHistoryResponse } from '@/types';

const CLOB_API_BASE_URL = 'https://clob.polymarket.com';

/**
 * Fetches price history for a specific token from CLOB API
 * Based on the curl example: curl 'https://clob.polymarket.com/prices-history?startTs=1768716110&market=74006651532972825037234110865226653639322418449976716216152926542127385791421&fidelity=60'
 * 
 * @param tokenId - The token ID from clobTokenIds array
 * @param startTs - Unix timestamp for start time (defaults to event creation time)
 * @param fidelity - Data point density (default: 60 seconds)
 */
export async function fetchPriceHistory(
  tokenId: string,
  startTs?: number,
  fidelity: number = 60
): Promise<PriceHistoryResponse> {
  try {
    // If startTs is not provided, use current time minus 7 days as default
    const startTimestamp = startTs || Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
    
    const response = await fetch(
      `${CLOB_API_BASE_URL}/prices-history?startTs=${startTimestamp}&market=${tokenId}&fidelity=${fidelity}`,
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
          'Referer': 'https://polymarket.com/',
          'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
    }

    const data: PriceHistoryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    // Return empty history instead of throwing to prevent app crashes
    return { history: [] };
  }
}

/**
 * Converts ISO date string to Unix timestamp
 */
export function isoDateToUnixTimestamp(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

/**
 * Fetches price history for both Over and Under tokens of a market
 */
export async function fetchMarketPriceHistory(
  overTokenId: string,
  underTokenId: string,
  eventCreationDate: string
): Promise<{
  overHistory: PriceHistoryResponse;
  underHistory: PriceHistoryResponse;
}> {
  const startTs = isoDateToUnixTimestamp(eventCreationDate);
  
  try {
    const [overHistory, underHistory] = await Promise.all([
      fetchPriceHistory(overTokenId, startTs),
      fetchPriceHistory(underTokenId, startTs),
    ]);

    return {
      overHistory,
      underHistory,
    };
  } catch (error) {
    console.error('Error fetching market price history:', error);
    // Return empty histories to prevent app crashes
    return {
      overHistory: { history: [] },
      underHistory: { history: [] }
    };
  }
}

/**
 * Transforms price history data for charting
 */
export function transformPriceHistoryForChart(
  overHistory: PriceHistoryResponse,
  underHistory: PriceHistoryResponse
): Array<{
  timestamp: number;
  overPrice: number;
  underPrice: number;
  date: string;
}> {
  // Create a map to combine data by timestamp
  const priceMap = new Map<number, { overPrice?: number; underPrice?: number }>();
  
  // Add Over prices
  overHistory.history.forEach(point => {
    if (!priceMap.has(point.t)) {
      priceMap.set(point.t, {});
    }
    priceMap.get(point.t)!.overPrice = point.p;
  });
  
  // Add Under prices
  underHistory.history.forEach(point => {
    if (!priceMap.has(point.t)) {
      priceMap.set(point.t, {});
    }
    priceMap.get(point.t)!.underPrice = point.p;
  });
  
  // Convert to array and sort by timestamp
  return Array.from(priceMap.entries())
    .map(([timestamp, prices]) => ({
      timestamp,
      overPrice: prices.overPrice ?? 0,
      underPrice: prices.underPrice ?? 0,
      date: new Date(timestamp * 1000).toISOString(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Fetches market details by condition ID or token ID to get bestAsk price
 * @param marketId - The market ID or condition ID
 */
export async function fetchMarketDetails(marketId: string): Promise<{ bestAsk: string } | null> {
  try {
    const response = await fetch(
      `https://clob.polymarket.com/markets/${marketId}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
          'Referer': 'https://polymarket.com/',
          'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      bestAsk: data.bestAsk || '0'
    };
  } catch (error) {
    console.error('Error fetching market details:', error);
    return null;
  }
}

/**
 * Fetches order book data for a specific token
 * @param tokenId - The token ID
 * @param side - Order book side ('ask' or 'bid')
 * @param depth - Number of levels to fetch (default: 10)
 */
export async function fetchOrderBook(
  tokenId: string,
  side: 'ask' | 'bid',
  depth: number = 10
): Promise<{ price: string; size: string }[] | null> {
  try {
    const response = await fetch(
      `https://clob.polymarket.com/book?token_id=${tokenId}&side=${side}&depth=${depth}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
          'Referer': 'https://polymarket.com/',
          'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CLOB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // The API returns levels in the "asks" or "bids" field depending on the side
    const levels = side === 'ask' ? data.asks : data.bids;
    return levels || [];
  } catch (error) {
    console.error('Error fetching order book:', error);
    return null;
  }
}

/**
 * Fetches best ask price and volume for both over and under tokens of a market
 * @param overTokenId - The over token ID
 * @param underTokenId - The under token ID
 */
export async function fetchBestAskData(
  overTokenId: string,
  underTokenId: string
): Promise<{
  overBestAskPrice: number | null;
  overBestAskVolume: number | null;
  underBestAskPrice: number | null;
  underBestAskVolume: number | null;
}> {
  try {
    // Fetch order book for both tokens
    const [overOrderBook, underOrderBook] = await Promise.all([
      fetchOrderBook(overTokenId, 'ask', 10),
      fetchOrderBook(underTokenId, 'ask', 10)
    ]);

    // Get the best ask (lowest price) for each token
    let overBestAskPrice: number | null = null;
    let overBestAskVolume: number | null = null;
    let underBestAskPrice: number | null = null;
    let underBestAskVolume: number | null = null;

    if (overOrderBook && overOrderBook.length > 0) {
      // Find the item with the lowest price
      const lowestAsk = overOrderBook.reduce((min, current) => {
        const currentPrice = parseFloat(current.price);
        const minPrice = parseFloat(min.price);
        return currentPrice < minPrice ? current : min;
      });
      overBestAskPrice = parseFloat(lowestAsk.price);
      overBestAskVolume = parseFloat(lowestAsk.size);
    }

    if (underOrderBook && underOrderBook.length > 0) {
      // Find the item with the lowest price
      const lowestAsk = underOrderBook.reduce((min, current) => {
        const currentPrice = parseFloat(current.price);
        const minPrice = parseFloat(min.price);
        return currentPrice < minPrice ? current : min;
      });
      underBestAskPrice = parseFloat(lowestAsk.price);
      underBestAskVolume = parseFloat(lowestAsk.size);
    }

    return {
      overBestAskPrice,
      overBestAskVolume,
      underBestAskPrice,
      underBestAskVolume
    };
  } catch (error) {
    console.error('Error fetching best ask data:', error);
    return {
      overBestAskPrice: null,
      overBestAskVolume: null,
      underBestAskPrice: null,
      underBestAskVolume: null
    };
  }
}

/**
 * Validates that price history data is valid for charting
 */
export function validatePriceHistoryData(
  overHistory: PriceHistoryResponse,
  underHistory: PriceHistoryResponse
): boolean {
  // Check if we have any data points
  return overHistory.history.length > 0 || underHistory.history.length > 0;
}
