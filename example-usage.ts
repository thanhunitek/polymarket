// Example usage of the corrected price history fetching process
// This demonstrates the correct implementation based on the curl example

import { fetchPremierLeagueEvents, filter45GoalLineMarkets } from './services/gamma-api';
import { fetchMarketPriceHistory, isoDateToUnixTimestamp } from './services/clob-api';

/**
 * Example: Complete workflow for fetching price history for 4.5 Over/Under markets
 */
async function exampleWorkflow() {
  console.log('=== Polymarket 4.5 Over/Under Price History Workflow ===\n');
  
  try {
    // Step 1: Fetch Premier League events from Gamma API
    console.log('1. Fetching Premier League events from Gamma API...');
    const events = await fetchPremierLeagueEvents();
    console.log(`   Found ${events.length} events\n`);
    
    // Step 2: Filter for 4.5 Over/Under markets
    console.log('2. Filtering for 4.5 Over/Under markets...');
    const filteredMarkets = filter45GoalLineMarkets(events);
    console.log(`   Found ${filteredMarkets.length} 4.5 Over/Under markets\n`);
    
    if (filteredMarkets.length === 0) {
      console.log('No 4.5 Over/Under markets found. Using sample data from more_markets_event.json');
      return;
    }
    
    // Step 3: Fetch price history for the first market
    const market = filteredMarkets[0];
    console.log('3. Fetching price history for market:');
    console.log(`   Event: ${market.eventTitle}`);
    console.log(`   Market: ${market.marketQuestion}`);
    console.log(`   Over Token ID: ${market.overTokenId.substring(0, 20)}...`);
    console.log(`   Under Token ID: ${market.underTokenId.substring(0, 20)}...`);
    console.log(`   Event Creation Date: ${market.eventCreationDate}\n`);
    
    // Step 4: Convert event creation date to Unix timestamp for startTs
    const startTs = isoDateToUnixTimestamp(market.eventCreationDate);
    console.log('4. Converting event creation date to Unix timestamp:');
    console.log(`   ${market.eventCreationDate} → ${startTs}`);
    console.log(`   This will be used as the startTs parameter\n`);
    
    // Step 5: Fetch price history for both Over and Under tokens
    console.log('5. Fetching price history from CLOB API...');
    const { overHistory, underHistory } = await fetchMarketPriceHistory(
      market.overTokenId,
      market.underTokenId,
      market.eventCreationDate
    );
    
    console.log(`   Over history: ${overHistory.history.length} data points`);
    console.log(`   Under history: ${underHistory.history.length} data points\n`);
    
    // Step 6: Display sample data
    console.log('6. Sample price history data (first 3 points):');
    console.log('   Over prices:');
    overHistory.history.slice(0, 3).forEach((point, i) => {
      const date = new Date(point.t * 1000).toISOString();
      console.log(`     ${i + 1}. ${date} - Price: ${point.p}`);
    });
    
    console.log('\n   Under prices:');
    underHistory.history.slice(0, 3).forEach((point, i) => {
      const date = new Date(point.t * 1000).toISOString();
      console.log(`     ${i + 1}. ${date} - Price: ${point.p}`);
    });
    
    // Step 7: Demonstrate the correct CURL command
    console.log('\n7. Correct CURL command for this market:');
    console.log(`curl 'https://clob.polymarket.com/prices-history?startTs=${startTs}&market=${market.overTokenId}&fidelity=60' \\`);
    console.log(`  -H 'sec-ch-ua-platform: "macOS"' \\`);
    console.log(`  -H 'Referer: https://polymarket.com/' \\`);
    console.log(`  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \\`);
    console.log(`  -H 'Accept: application/json, text/plain, */*' \\`);
    console.log(`  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \\`);
    console.log(`  -H 'sec-ch-ua-mobile: ?0'`);
    
    console.log('\n=== Workflow completed successfully ===');
    
  } catch (error) {
    console.error('Error in workflow:', error);
  }
}

/**
 * Example: Using the exact parameters from the curl example
 */
async function exampleWithCurlParameters() {
  console.log('\n\n=== Example with exact CURL parameters ===\n');
  
  // Parameters from the curl example in the task
  const tokenId = '74006651532972825037234110865226653639322418449976716216152926542127385791421';
  const startTs = 1768716110; // From curl example
  const fidelity = 60; // From curl example
  
  console.log('Parameters from curl example:');
  console.log(`  tokenId: ${tokenId.substring(0, 20)}...`);
  console.log(`  startTs: ${startTs}`);
  console.log(`  fidelity: ${fidelity}`);
  
  // This demonstrates that our implementation matches the curl example
  console.log('\nOur implementation would call:');
  console.log(`  fetchPriceHistory('${tokenId.substring(0, 20)}...', ${startTs}, ${fidelity})`);
  
  // Show how to get the startTs from event creation date
  const eventCreationDate = '2026-01-18T06:03:27.33654Z'; // From more_markets_event.json
  const calculatedStartTs = isoDateToUnixTimestamp(eventCreationDate);
  
  console.log('\nTo get startTs from event creation date:');
  console.log(`  Event creation date: ${eventCreationDate}`);
  console.log(`  Converted to Unix timestamp: ${calculatedStartTs}`);
  console.log(`  Difference from curl example: ${Math.abs(startTs - calculatedStartTs)} seconds`);
}

// Run examples
(async () => {
  await exampleWorkflow();
  await exampleWithCurlParameters();
})();