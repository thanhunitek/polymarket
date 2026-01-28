'use client';

import React from 'react';
import { TeamStats } from '@/types';
import { MatchHistoryTable } from './match-history-table';
import { normalizeToDisplay } from '@/lib/team-name-normalizer';

interface TeamStatsCardProps {
  team: TeamStats;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TeamStatsCard({ team, isExpanded, onToggle }: TeamStatsCardProps) {
  const displayName = normalizeToDisplay(team.teamName);
  const over45Percentage = team.over45Percentage.toFixed(1);

  return (
    <div
      className="rounded-lg border transition-all duration-150"
      style={{
        background: 'var(--background-secondary)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Collapsed Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex items-center justify-between transition-colors duration-150 hover:bg-[var(--background-hover)]"
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{displayName}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {team.matchesPlayed} matches: {' '}
            <span className="font-bold" style={{ color: 'var(--market-over)' }}>
              {team.over45Count} Over 4.5
            </span>
            {' '}({over45Percentage}%)
          </p>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="ml-4">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className="border-t p-4 animate-in slide-in-from-top-2 duration-200"
          style={{
            borderColor: 'var(--border-default)',
          }}
        >
          <MatchHistoryTable matches={team.allMatches} teamName={team.teamName} />
        </div>
      )}
    </div>
  );
}
