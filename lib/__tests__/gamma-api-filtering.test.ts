import { filter45GoalLineMarkets, is45OverUnderMarket } from '@/services/gamma-api';
import { GammaEvent } from '@/types';

describe('Gamma API Filtering', () => {
  // Test the market filtering logic directly
  test('should correctly identify 4.5 Over/Under markets', () => {
    const testMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 4.5?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(true);
  });

  test('should reject markets with 2.5 goal line', () => {
    const testMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 2.5?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(false);
  });

  test('should reject markets with 3.5 goal line', () => {
    const testMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 3.5?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(false);
  });

  test('should reject markets with 5.5 goal line', () => {
    const testMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 5.5?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(false);
  });

  test('should reject markets without "total goals"', () => {
    const testMarket = {
      question: 'EPL: Will Liverpool FC beat Newcastle United FC?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(false);
  });

  test('should reject markets without "over" or "under"', () => {
    const testMarket = {
      question: 'EPL: Will Liverpool FC beat Newcastle United FC by more than 4.5 goals?',
      outcomePrices: '["0.45", "0.55"]',
      clobTokenIds: '["123", "456"]'
    } as any;
    
    expect(is45OverUnderMarket(testMarket)).toBe(false);
  });

  // Test the new slug filtering logic
  test('should filter events with correct slug ending', () => {
    const testEvent = {
      slug: 'epl-liv-new-2026-01-31-more-markets',
      markets: [
        {
          slug: 'epl-liv-new-2026-01-31-total-4pt5',
          question: 'Liverpool FC vs. Newcastle United FC: O/U 4.5',
          outcomePrices: '["0.185", "0.815"]',
          clobTokenIds: '["74006651532972825037234110865226653639322418449976716216152926542127385791421", "66491196839147266221769002702257497103901099666723843451099260303326831714929"]'
        }
      ]
    } as any;
    
    const events = [testEvent];
    const result = filter45GoalLineMarkets(events);
    
    expect(result).toHaveLength(1);
    expect(result[0].marketSlug).toBe('epl-liv-new-2026-01-31-total-4pt5');
  });

  test('should filter out events without correct slug ending', () => {
    const testEvent = {
      slug: 'epl-liv-new-2026-01-31-normal-event',
      markets: [
        {
          slug: 'epl-liv-new-2026-01-31-total-4pt5',
          question: 'Liverpool FC vs. Newcastle United FC: O/U 4.5',
          outcomePrices: '["0.185", "0.815"]',
          clobTokenIds: '["74006651532972825037234110865226653639322418449976716216152926542127385791421", "66491196839147266221769002702257497103901099666723843451099260303326831714929"]'
        }
      ]
    } as any;
    
    const events = [testEvent];
    const result = filter45GoalLineMarkets(events);
    
    expect(result).toHaveLength(0);
  });

  test('should filter out markets without correct slug ending', () => {
    const testEvent = {
      slug: 'epl-liv-new-2026-01-31-more-markets',
      markets: [
        {
          slug: 'epl-liv-new-2026-01-31-total-2pt5',
          question: 'Liverpool FC vs. Newcastle United FC: O/U 2.5',
          outcomePrices: '["0.45", "0.55"]',
          clobTokenIds: '["123", "456"]'
        }
      ]
    } as any;
    
    const events = [testEvent];
    const result = filter45GoalLineMarkets(events);
    
    expect(result).toHaveLength(0);
  });
});