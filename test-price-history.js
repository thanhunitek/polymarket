// Test script to verify the CLOB API implementation matches the curl example
import fetch from 'node-fetch';

async function testClobApi() {
  console.log('Testing CLOB API with parameters from curl example...\n');
  
  const tokenId = '74006651532972825037234110865226653639322418449976716216152926542127385791421';
  const startTs = 1768716110;
  const fidelity = 60;
  
  const url = `https://clob.polymarket.com/prices-history?startTs=${startTs}&market=${tokenId}&fidelity=${fidelity}`;
  
  console.log('URL:', url);
  console.log('Headers:', {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    'Referer': 'https://polymarket.com/',
    'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
  });
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
        'Referer': 'https://polymarket.com/',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    });
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Success! Received price history data:');
    console.log(`Total data points: ${data.history.length}`);
    console.log('\nFirst 5 data points:');
    data.history.slice(0, 5).forEach((point, i) => {
      console.log(`  ${i + 1}. timestamp: ${point.t}, price: ${point.p}`);
    });
    
    console.log('\nLast 5 data points:');
    data.history.slice(-5).forEach((point, i) => {
      console.log(`  ${i + 1}. timestamp: ${point.t}, price: ${point.p}`);
    });
    
    // Test the ISO date conversion
    console.log('\n📅 Testing date conversion:');
    const sampleDate = '2026-01-18T06:03:27.33654Z';
    const timestamp = Math.floor(new Date(sampleDate).getTime() / 1000);
    console.log(`ISO Date: ${sampleDate}`);
    console.log(`Unix Timestamp: ${timestamp}`);
    
    // Test with the event creation date from more_markets_event.json
    const eventCreationDate = '2026-01-18T06:03:27.33654Z';
    const eventTimestamp = Math.floor(new Date(eventCreationDate).getTime() / 1000);
    console.log(`\nEvent creation date: ${eventCreationDate}`);
    console.log(`Event creation timestamp: ${eventTimestamp}`);
    console.log(`Should be used as startTs parameter`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Test the Gamma API filtering
async function testGammaApiFiltering() {
  console.log('\n\nTesting Gamma API filtering logic...\n');
  
  // Read the sample data
  import fs from 'fs';
  const sampleData = JSON.parse(fs.readFileSync('./more_markets_event.json', 'utf8'));
  
  console.log('Sample event title:', sampleData.title);
  console.log('Has "- More Markets" in title:', sampleData.title.includes('- More Markets'));
  
  // Check each market
  sampleData.markets.forEach((market, index) => {
    const question = market.question.toLowerCase();
    const hasTotalGoals = question.includes('total goals') || question.includes('o/u');
    const has45Line = /\b4\.5\b/.test(market.question);
    const isOverUnder = question.includes('over') && question.includes('under');
    const is45Market = hasTotalGoals && has45Line && isOverUnder;
    
    console.log(`\nMarket ${index + 1}: "${market.question}"`);
    console.log(`  Has "total goals" or "O/U": ${hasTotalGoals}`);
    console.log(`  Has "4.5" line: ${has45Line}`);
    console.log(`  Is Over/Under market: ${isOverUnder}`);
    console.log(`  Is 4.5 Over/Under market: ${is45Market}`);
    
    if (is45Market) {
      console.log(`  Token IDs: ${market.clobTokenIds}`);
      console.log(`  Outcome Prices: ${market.outcomePrices}`);
    }
  });
}

// Run tests
(async () => {
  await testClobApi();
  await testGammaApiFiltering();
})();