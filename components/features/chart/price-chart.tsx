'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define types for our chart data
interface ChartDataPoint {
  timestamp: number;
  date: string;
  overPrice: number;
  underPrice: number;
}

interface PriceChartProps {
  overHistory: any[];
  underHistory: any[];
  loading: boolean;
  error: string | null;
}

export function PriceChart({ overHistory, underHistory, loading, error }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Transform the data for the chart
  useEffect(() => {
    if (loading || error) return;

    // Create a map to combine data by timestamp
    const priceMap = new Map<number, { overPrice?: number; underPrice?: number }>();
    
    // Add Over prices
    overHistory.forEach(point => {
      if (!priceMap.has(point.t)) {
        priceMap.set(point.t, {});
      }
      priceMap.get(point.t)!.overPrice = point.p;
    });
    
    // Add Under prices
    underHistory.forEach(point => {
      if (!priceMap.has(point.t)) {
        priceMap.set(point.t, {});
      }
      priceMap.get(point.t)!.underPrice = point.p;
    });
    
    // Convert to array and sort by timestamp
    const data = Array.from(priceMap.entries())
      .map(([timestamp, prices]) => ({
        timestamp,
        overPrice: prices.overPrice ?? 0,
        underPrice: prices.underPrice ?? 0,
        date: new Date(timestamp * 1000).toLocaleString(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    setChartData(data);
  }, [overHistory, underHistory, loading, error]);

  // Ensure the chart properly updates when filtered data changes
  useEffect(() => {
    // This effect ensures that when timeRange changes, the chart properly updates
    // The chart data is already filtered in filteredChartData, so this is mainly for ensuring reactivity
    // We don't need to do anything here as the filteredChartData is already computed
  }, [timeRange]);

  // Filter data based on selected time range
  const filteredChartData = chartData.filter(point => {
    const now = Date.now();
    const pointTime = point.timestamp * 1000;
    
    switch (timeRange) {
      case '1h':
        return now - pointTime <= 60 * 60 * 1000;
      case '24h':
        return now - pointTime <= 24 * 60 * 60 * 1000;
      case '7d':
        return now - pointTime <= 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return now - pointTime <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  // Ensure the chart re-renders when filtered data changes
  useEffect(() => {
    // This effect ensures that when timeRange changes, the chart properly updates
    // The chart data is already filtered in filteredChartData, so this is mainly for ensuring reactivity
  }, [timeRange, filteredChartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
              <p className="mt-1 text-xs">
                This might be due to API limitations or CORS restrictions. Try refreshing the page or check your network connection.
                <br />
                <span className="font-medium">Note:</span> The CLOB API may have rate limits or be temporarily unavailable.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0 || filteredChartData.length === 0) {
    if (chartData.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">No price history data</h3>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            No price history data is available for this market.
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">No data for selected range</h3>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            No data is available for the selected time range.
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Try selecting a different time range.
          </p>
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Price History</h3>
        <div className="flex flex-wrap gap-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickCount={5}
              tickMargin={8}
            />
            <YAxis 
              domain={[0, 1]} 
              tick={{ fontSize: 12 }}
              tickMargin={8}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip
              formatter={(value) => [`${(Number(value) * 100).toFixed(2)}%`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#e5e7eb', 
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}
              itemStyle={{ color: '#1f2937' }}
              labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="overPrice"
              name="Over 4.5"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="underPrice"
              name="Under 4.5"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
