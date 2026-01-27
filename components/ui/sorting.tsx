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
      <div className="inline-flex rounded-lg shadow-sm bg-white dark:bg-gray-800 p-1" role="group">
        <button
          type="button"
          onClick={() => handleSortChange('date')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortType === 'date'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Date
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('over')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortType === 'over'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Over Price
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('under')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortType === 'under'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Under Price
        </button>
        <button
          type="button"
          onClick={() => handleSortChange('bestAskUnder')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            sortType === 'bestAskUnder'
              ? 'bg-blue-600 text-white shadow'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Best Ask
        </button>
      </div>
    </div>
  );
}
