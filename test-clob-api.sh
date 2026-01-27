#!/bin/bash

echo "Testing CLOB API with parameters from curl example..."
echo ""

# Test the exact curl command from the task
curl 'https://clob.polymarket.com/prices-history?startTs=1768716110&market=74006651532972825037234110865226653639322418449976716216152926542127385791421&fidelity=60' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Referer: https://polymarket.com/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  | jq '.history | length'

echo ""
echo "Testing with event creation date as startTs..."

# Extract event creation date from more_markets_event.json
EVENT_CREATION_DATE="2026-01-18T06:03:27.33654Z"
echo "Event creation date: $EVENT_CREATION_DATE"

# Convert to Unix timestamp
START_TS=$(node -e "console.log(Math.floor(new Date('$EVENT_CREATION_DATE').getTime() / 1000))")
echo "Unix timestamp: $START_TS"

echo ""
echo "Testing CLOB API with event creation timestamp..."
curl "https://clob.polymarket.com/prices-history?startTs=$START_TS&market=74006651532972825037234110865226653639322418449976716216152926542127385791421&fidelity=60" \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'Referer: https://polymarket.com/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"' \
  -H 'sec-ch-ua-mobile: ?0' \
  | jq '.history[0:5]'

echo ""
echo "Testing Gamma API filtering logic..."

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing jq..."
    brew install jq
fi

echo ""
echo "Analyzing more_markets_event.json for 4.5 Over/Under markets..."

# Use jq to filter and display 4.5 markets
jq -r '.markets[] | select(.question | test("4\\.5"; "i")) | "Market: \(.question)\nToken IDs: \(.clobTokenIds)\nOutcome Prices: \(.outcomePrices)\n"' more_markets_event.json

echo ""
echo "Testing date conversion function..."
node -e "
const eventCreationDate = '2026-01-18T06:03:27.33654Z';
const timestamp = Math.floor(new Date(eventCreationDate).getTime() / 1000);
console.log('Event creation date:', eventCreationDate);
console.log('Unix timestamp:', timestamp);
console.log('This should be used as startTs parameter');
"