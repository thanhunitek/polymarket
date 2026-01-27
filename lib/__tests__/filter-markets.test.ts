import { validateMarketFiltering, is45OverUnderMarket } from '../filter-markets';

describe('Market Filtering Logic', () => {
  test('should correctly identify 4.5 Over/Under markets', () => {
    const validMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 4.5?'
    } as any;
    
    expect(is45OverUnderMarket(validMarket)).toBe(true);
  });

  test('should reject markets with 2.5 goal line', () => {
    const invalidMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 2.5?'
    } as any;
    
    expect(is45OverUnderMarket(invalidMarket)).toBe(false);
  });

  test('should reject markets with 3.5 goal line', () => {
    const invalidMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 3.5?'
    } as any;
    
    expect(is45OverUnderMarket(invalidMarket)).toBe(false);
  });

  test('should reject markets with 5.5 goal line', () => {
    const invalidMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 5.5?'
    } as any;
    
    expect(is45OverUnderMarket(invalidMarket)).toBe(false);
  });

  test('should reject markets with 14.5 goal line (should not match 4.5)', () => {
    const invalidMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 14.5?'
    } as any;
    
    expect(is45OverUnderMarket(invalidMarket)).toBe(false);
  });

  test('should correctly validate 4.5 markets with strict rules', () => {
    const validMarket = {
      question: 'EPL: Will the total goals in the match between Liverpool FC and Newcastle United FC be over or under 4.5?'
    } as any;
    
    expect(validateMarketFiltering(validMarket)).toBe(true);
  });

  test('should reject 4.5 markets that are not Over/Under', () => {
    const invalidMarket = {
      question: 'EPL: Will Liverpool FC beat Newcastle United FC by more than 4.5 goals?'
    } as any;
    
    expect(validateMarketFiltering(invalidMarket)).toBe(false);
  });

  test('should reject markets without "total goals"', () => {
    const invalidMarket = {
      question: 'EPL: Will Liverpool FC beat Newcastle United FC?'
    } as any;
    
    expect(validateMarketFiltering(invalidMarket)).toBe(false);
  });
});