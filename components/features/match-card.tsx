'use client';

import React from 'react';
import { FilteredMarket } from '@/types';
import { formatUTC7DateTime } from '@/lib/date-utils';

interface MatchCardProps {
  market: FilteredMarket;
  onClick: () => void;
  isSelected: boolean;
  isLoading: boolean;
  onOpenEvent: () => void;
}

export function MatchCard({ market, onClick, isSelected, isLoading, onOpenEvent }: MatchCardProps) {
  // Convert prices to percentages
  const overPercentage = (market.currentOverPrice * 100).toFixed(0);
  const underPercentage = (market.currentUnderPrice * 100).toFixed(0);
  const askOverPercentage = market.bestAskOverPrice !== null && market.bestAskOverPrice !== undefined
    ? (market.bestAskOverPrice * 100).toFixed(0)
    : null;
  const askUnderPercentage = market.bestAskUnderPrice !== null && market.bestAskUnderPrice !== undefined
    ? (market.bestAskUnderPrice * 100).toFixed(0)
    : null;

  return (
    <div
      onClick={onClick}
      className={`
        p-4 cursor-pointer rounded-lg border transition-all duration-150
        ${isSelected
          ? 'border-[var(--brand-primary)] shadow-[0_0_0_1px_var(--brand-primary)]'
          : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
        }
      `}
      style={{ background: 'var(--background-secondary)' }}
    >
      {/* Event Header */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold text-white line-clamp-2 flex-1 pr-3">
          {market.eventTitle}
        </h2>
        <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
          {formatUTC7DateTime(market.gameStartTime)}
        </span>
      </div>

      {/* Outcome Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Over */}
        <div
          className="p-3 rounded-lg border"
          style={{
            background: 'var(--background-tertiary)',
            borderColor: 'var(--market-over)'
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Over 4.5
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--market-over)' }}>
            {overPercentage}%
          </p>
          {askOverPercentage !== null && (
            <p className="text-xs mt-2 tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
              Ask: {askOverPercentage}%
            </p>
          )}
          {market.bestAskOverVolume !== null && market.bestAskOverVolume !== undefined && (
            <p className="text-xs tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
              Vol: {market.bestAskOverVolume.toFixed(0)}
            </p>
          )}
        </div>

        {/* Under */}
        <div
          className="p-3 rounded-lg border"
          style={{
            background: 'var(--background-tertiary)',
            borderColor: 'var(--market-under)'
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Under 4.5
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--market-under)' }}>
            {underPercentage}%
          </p>
          {askUnderPercentage !== null && (
            <p className="text-xs mt-2 tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
              Ask: {askUnderPercentage}%
            </p>
          )}
          {market.bestAskUnderVolume !== null && market.bestAskUnderVolume !== undefined && (
            <p className="text-xs tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
              Vol: {market.bestAskUnderVolume.toFixed(0)}
            </p>
          )}
        </div>
      </div>

      {/* Market Question */}
      <p className="text-xs line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
        {market.marketQuestion}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEvent();
          }}
          className="flex-1 text-sm px-3 py-2 rounded-lg font-medium transition-all duration-150"
          style={{
            background: 'var(--brand-primary)',
            color: 'white'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--brand-primary)'}
        >
          View Event
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex-1 text-sm px-3 py-2 rounded-lg font-medium border transition-all duration-150"
          style={{
            background: 'transparent',
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--background-hover)';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border-default)';
          }}
        >
          View Details
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center mt-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--brand-primary)' }}></div>
          <span className="ml-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>Loading...</span>
        </div>
      )}
    </div>
  );
}
