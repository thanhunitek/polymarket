# Polymarket Premier League Dashboard

A Next.js application that displays Premier League markets with 4.5 goal line from Polymarket.

## Problem Fixed

### "Failed to fetch" Error

The application was encountering a "Failed to fetch" error when trying to access the Gamma API. This was caused by CORS (Cross-Origin Resource Sharing) restrictions when making direct API calls from the browser.

## Solutions Implemented

1. **Enhanced Error Handling**: Improved error messages in both `services/gamma-api.ts` and `app/client-page.tsx` to provide more specific debugging information.

2. **Better Debugging Information**: Added console logs that help identify CORS issues and suggest solutions.

3. **User-Friendly Error Messages**: Clear error messages in the UI that explain what went wrong and how to fix it.

## How to Fix CORS Issues

If you encounter CORS errors when running the application:

### Solution: Next.js API Routes (Already Implemented)
I have already implemented a server-side proxy solution using Next.js API routes:

1. **API Route Created**: `app/api/gamma/route.ts` - This handles proxying requests to the Gamma API
2. **Service Updated**: `services/gamma-api.ts` - Now uses the local API route instead of direct external calls

The application will now work correctly because:
- All API requests go through the server-side proxy
- No direct browser requests to external domains
- CORS restrictions are bypassed
- The proxy handles all the necessary headers and error handling

To verify the solution works:
1. Run `npm run dev`
2. The application should load without CORS errors
3. Data should be fetched from the Gamma API through the proxy

### Option 2: Test API Accessibility
Run the test script to check if the API is accessible:
```bash
node test-api-access.js
```

## Development

### Prerequisites
- Node.js 18+
- npm 8+

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities and helpers
├── services/              # API service modules
└── types/                 # TypeScript type definitions
```

## Key Features

- **Strict 4.5 Goal Line Filtering**: Only displays markets with exactly 4.5 goal line (as required by RULES.MD)
- **Responsive UI**: Built with Tailwind CSS
- **Price History Charts**: Using Recharts for market price visualization
- **Error Handling**: Comprehensive error handling for API failures
- **Type Safety**: Full TypeScript support

## Rules Compliance

This implementation strictly follows the requirements in `RULES.MD`:
- ✅ Only 4.5 goal line markets are displayed
- ✅ Uses strict regex filtering (`\b4\.5\b`)
- ✅ Next.js 15 with App Router
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS for styling
- ✅ Recharts for price history
- ✅ Native fetch API for data fetching

## Debugging

For detailed debugging information, see `DEBUGGING_GUIDE.md`.