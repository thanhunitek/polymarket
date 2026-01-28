'use client';

import React from 'react';
import { MatchResult } from '@/types';

interface MatchHistoryTableProps {
  matches: MatchResult[];
  teamName: string;
}

export function MatchHistoryTable({ matches, teamName }: MatchHistoryTableProps) {
  if (matches.length === 0) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
        No match data available for this team
      </div>
    );
  }

  // Calculate summary
  const over45Count = matches.filter((m) => m.isOver45).length;
  const matchesPlayed = matches.length;
  const over45Percentage = matchesPlayed > 0 ? ((over45Count / matchesPlayed) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-3">
      {/* Summary Row */}
      <div
        className="p-3 rounded-lg border"
        style={{
          background: 'var(--background-tertiary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          <span className="font-bold">{over45Count}</span> / {matchesPlayed} matches Over 4.5{' '}
          <span style={{ color: 'var(--market-over)' }}>({over45Percentage}%)</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-secondary)',
              }}
            >
              <th className="text-left py-2 px-3 font-medium">Date</th>
              <th className="text-left py-2 px-3 font-medium">Match</th>
              <th className="text-center py-2 px-3 font-medium">Score</th>
              <th className="text-center py-2 px-3 font-medium">Total</th>
              <th className="text-center py-2 px-3 font-medium">Over 4.5?</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => {
              const isTeamHome = match.team1 === teamName;
              const opponent = isTeamHome ? match.team2 : match.team1;
              const teamScore = isTeamHome ? match.score.ft[0] : match.score.ft[1];
              const opponentScore = isTeamHome ? match.score.ft[1] : match.score.ft[0];

              return (
                <tr
                  key={index}
                  className={`border-b ${match.isOver45 ? 'font-medium' : ''}`}
                  style={{
                    borderColor: 'var(--border-default)',
                    background: match.isOver45 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                  }}
                >
                  <td className="py-2 px-3" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(match.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-medium">
                      {isTeamHome ? 'vs' : '@'} {opponent.replace(' FC', '')}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-bold">{teamScore}</span>-<span className="font-bold">{opponentScore}</span>
                  </td>
                  <td className="py-2 px-3 text-center tabular-nums font-bold" style={{ color: 'var(--text-primary)' }}>
                    {match.totalGoals}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {match.isOver45 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: 'var(--market-over)' }}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
