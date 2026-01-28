import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [response2024, response2025] = await Promise.all([
      fetch('https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/en.1.json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
      fetch('https://raw.githubusercontent.com/openfootball/football.json/master/2025-26/en.1.json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }),
    ]);

    // Handle 404 for 2025-26 season gracefully (might not exist yet)
    const data2024 = response2024.ok ? await response2024.json() : null;
    const data2025 = response2025.ok ? await response2025.json() : null;

    if (!data2024 && !data2025) {
      throw new Error('No season data available');
    }

    // Return both seasons if available, otherwise just what we have
    const combinedData = {
      '2024-25': data2024,
      '2025-26': data2025,
    };

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error proxying match history data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match history data' },
      { status: 500 }
    );
  }
}
