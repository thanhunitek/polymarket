import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://gamma-api.polymarket.com/events?tag_id=82&closed=false&limit=100&offset=0', {
      method: 'GET',
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