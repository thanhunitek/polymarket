// Simple script to test if the Gamma API is accessible
// Run with: node test-api-access.js

async function testApiAccess() {
  const apiUrl = 'https://gamma-api.polymarket.com/events?tag_id=82&closed=false&limit=100&offset=0';
  
  console.log('Testing API access to:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
        'Referer': 'https://polymarket.com/',
      },
    });
    
    console.log('Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API is accessible! Received', data.length, 'events');
      return true;
    } else {
      console.log('API returned error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('API test failed:', error.message);
    console.error('This is likely a CORS error when run in browser');
    console.error('Try running this script with Node.js or using a proxy');
    return false;
  }
}

// Run the test
testApiAccess().then(success => {
  if (success) {
    console.log('\n✅ API is accessible');
  } else {
    console.log('\n❌ API is not accessible or CORS blocked');
  }
});