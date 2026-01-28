'use client';

import React from 'react';
import { MatchResult } from '@/types';

interface TeamHistoryChartProps {
  matches: MatchResult[];
}

export function TeamHistoryChart({ matches }: TeamHistoryChartProps) {
  if (matches.length === 0) {
    return null;
  }

  // Calculate rolling statistics for last 10 matches
  const last10 = matches.slice(0, 10);
  const over45InLast10 = last10.filter(m => m.isOver45).length;
  const percentageLast10 = last10.length > 0 ? (over45InLast10 / last10.length) * 100 : 0;

  // Overall stats
  const overallOver45 = matches.filter(m => m.isOver45).length;
  const overallPercentage = matches.length > 0 ? (overallOver45 / matches.length) * 100 : 0;

  // Season breakdown
  const seasonStats = matches.reduce((acc, match) => {
    if (!acc[match.season]) {
      acc[match.season] = { total: 0, over45: 0 };
    }
    acc[match.season].total++;
    if (match.isOver45) {
      acc[match.season].over45++;
    }
    return acc;
  }, {} as Record<string, { total: number; over45: number }>);

  return (
    <div className="space-y-4 mb-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall */}
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'var(--background-tertiary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
            Overall
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--market-over)' }}>
            {overallPercentage.toFixed(1)}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {overallOver45} / {matches.length} matches
          </p>
        </div>

        {/* Last 10 */}
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'var(--background-tertiary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
            Last 10 Matches
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--market-over)' }}>
            {percentageLast10.toFixed(1)}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {over45InLast10} / {last10.length} matches
          </p>
        </div>

        {/* Season Breakdown */}
        <div
          className="p-4 rounded-lg border"
          style={{
            background: 'var(--background-tertiary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
            By Season
          </p>
          <div className="space-y-1">
            {Object.entries(seasonStats).sort((a, b) => b[0].localeCompare(a[0])).map(([season, stats]) => {
              const percentage = (stats.over45 / stats.total) * 100;
              return (
                <div key={season} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{season}:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {percentage.toFixed(0)}% ({stats.over45}/{stats.total})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simple Bar Chart for Last 10 Matches */}
      <div
        className="p-4 rounded-lg border"
        style={{
          background: 'var(--background-tertiary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          Last 10 Matches (Most Recent First)
        </p>
        <div className="flex items-end justify-between gap-2 h-24">
          {last10.map((match, index) => {
            const height = (match.totalGoals / 10) * 100; // Scale to max 10 goals
            const isOver = match.isOver45;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full flex justify-center items-end h-20">
                  <div
                    className="w-full rounded-t transition-all duration-150 hover:opacity-80"
                    style={{
                      height: `${Math.max(height, 10)}%`,
                      background: isOver ? 'var(--market-over)' : 'var(--market-under)',
                    }}
                    title={`${match.team1} vs ${match.team2}: ${match.totalGoals} goals`}
                  />
                </div>
                <p className="text-xs font-bold tabular-nums" style={{ color: isOver ? 'var(--market-over)' : 'var(--text-tertiary)' }}>
                  {match.totalGoals}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>Most Recent</span>
          <span>10 matches ago</span>
        </div>
      </div>
    </div>
  );
}
