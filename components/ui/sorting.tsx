'use client';

import React, { useState } from 'react';

export function SortingControls({ onSortChange }: { onSortChange: (sort: 'date' | 'over' | 'under' | 'bestAskUnder') => void }) {
  const [sortType, setSortType] = useState<'date' | 'over' | 'under' | 'bestAskUnder'>('date');

  const handleSortChange = (sort: 'date' | 'over' | 'under' | 'bestAskUnder') => {
    setSortType(sort);
    onSortChange(sort);
  };

  return (
    <div className="flex justify-end mb-6">
      <div className="inline-flex rounded-lg p-1" role="group" style={{ background: 'var(--background-secondary)' }}>
        <button
          type="button"
          onClick={() => handleSortChange('date')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
            sortType === 'date' ? '' : ''
          }`}
          style={
            sortType === 'date'
              ? { background: 'var(--brand-primary)', color: 'white' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
          onMouseEnter={(e) => {
            if (sortType !== 'date') {
              e.currentTarget.style.background = 'var(--background-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortType !== 'date') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Date
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('over')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150`}
          style={
            sortType === 'over'
              ? { background: 'var(--brand-primary)', color: 'white' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
          onMouseEnter={(e) => {
            if (sortType !== 'over') {
              e.currentTarget.style.background = 'var(--background-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortType !== 'over') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Over Price
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('under')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150`}
          style={
            sortType === 'under'
              ? { background: 'var(--brand-primary)', color: 'white' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
          onMouseEnter={(e) => {
            if (sortType !== 'under') {
              e.currentTarget.style.background = 'var(--background-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortType !== 'under') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Under Price
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('bestAskUnder')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150`}
          style={
            sortType === 'bestAskUnder'
              ? { background: 'var(--brand-primary)', color: 'white' }
              : { background: 'transparent', color: 'var(--text-secondary)' }
          }
          onMouseEnter={(e) => {
            if (sortType !== 'bestAskUnder') {
              e.currentTarget.style.background = 'var(--background-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (sortType !== 'bestAskUnder') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          Best Ask
        </button>
      </div>
    </div>
  );
}
