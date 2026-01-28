'use client';

import React from 'react';
import { TeamStats } from '@/types';
import { normalizeToDisplay } from '@/lib/team-name-normalizer';

interface TeamStatsCardProps {
  team: TeamStats;
  onClick: () => void;
}

export function TeamStatsCard({ team, onClick }: TeamStatsCardProps) {
  const displayName = normalizeToDisplay(team.teamName);
  const over45Percentage = team.over45Percentage.toFixed(1);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border transition-all duration-150 hover:border-[var(--border-hover)] hover:shadow-lg"
      style={{
        background: 'var(--background-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="p-4 text-left">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{displayName}</h3>
          <div className="ml-4">
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--text-tertiary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total Matches: <span className="font-medium text-white">{team.matchesPlayed}</span>
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Over 4.5: <span className="font-bold" style={{ color: 'var(--market-over)' }}>
              {team.over45Count} ({over45Percentage}%)
            </span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Click to view match history
          </p>
        </div>
      </div>
    </button>
  );
}
