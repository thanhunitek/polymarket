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
  return (
    <div 
      onClick={onClick}
      className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
      } bg-white dark:bg-gray-800`}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold text-black dark:text-white line-clamp-1">
          {market.eventTitle}
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatUTC7DateTime(market.gameStartTime)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-300 font-medium">Over 4.5</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
            {market.currentOverPrice.toFixed(2)}
          </p>
          {market.bestAskOverPrice !== null && market.bestAskOverPrice !== undefined && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Ask: {market.bestAskOverPrice.toFixed(2)}
            </p>
          )}
          {market.bestAskOverVolume !== null && market.bestAskOverVolume !== undefined && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Vol: {market.bestAskOverVolume.toFixed(0)}
            </p>
          )}
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-300 font-medium">Under 4.5</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
            {market.currentUnderPrice.toFixed(2)}
          </p>
          {market.bestAskUnderPrice !== null && market.bestAskUnderPrice !== undefined && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Ask: {market.bestAskUnderPrice.toFixed(2)}
            </p>
          )}
          {market.bestAskUnderVolume !== null && market.bestAskUnderVolume !== undefined && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Vol: {market.bestAskUnderVolume.toFixed(0)}
            </p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
        {market.marketQuestion}
      </p>
      
      <div className="flex justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling to the card click
            onOpenEvent();
          }}
          className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          View Event
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling to the card click
            onClick();
          }}
          className="flex-1 text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          View Details
        </button>
      </div>
      
      <div className="mt-3">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}
