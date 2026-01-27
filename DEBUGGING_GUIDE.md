# Debugging Guide: "Failed to fetch" Error

## Problem
The application is encountering a "Failed to fetch" error when trying to access the Gamma API at `https://gamma-api.polymarket.com/events?tag_id=82&closed=false&limit=100&offset=0`.

## Root Cause
This is a CORS (Cross-Origin Resource Sharing) error. The browser is blocking the request because:
1. The API endpoint is on a different domain (cross-origin)
2. The server doesn't include the appropriate CORS headers
3. The request is being made directly from the browser client-side

## Solutions

### Solution 1: Run with a Proxy Server
If you're running the development server, you can set up a proxy to bypass CORS restrictions:

```bash
# Install a simple proxy server
npm install -g http-proxy-middleware

# Or use Next.js API routes (recommended approach)
```

### Solution 2: Use Next.js API Routes (Recommended)
Create a server-side API route to proxy the request:

1. Create `app/api/gamma/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://gamma-api.polymarket.com/events?tag_id=82&closed=false&limit=100&offset=0', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
        'Referer': 'https://polymarket.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying Gamma API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Gamma API' },
      { status: 500 }
    );
  }
}
```

2. Update `services/gamma-api.ts` to use the API route:
```typescript
const GAMMA_API_BASE_URL = '/api/gamma'; // Use local API route
```

### Solution 3: Test with Mock Data
For development/testing purposes, you can mock the API response:

```typescript
// In your test environment or development
const mockEvents: GammaEvent[] = [
  // Mock data here
];

// Mock fetch in tests
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(mockEvents)
});
```

## Current Implementation Improvements
The code has been updated to provide better error messages and debugging information:

1. **Enhanced Error Messages**: More specific error messages for CORS issues
2. **Debugging Information**: Console logs with potential solutions
3. **Better User Experience**: Clear error messages in the UI

## Testing the Fix
1. Run the application with `npm run dev`
2. Check the browser console for detailed error messages
3. If CORS error persists, implement one of the solutions above

## Expected Behavior
- When API is accessible: Data loads normally
- When API is blocked (CORS): Clear error message with debugging steps
- When API returns errors: Proper error handling with user-friendly messages