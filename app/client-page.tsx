'use client';
import { fetchPremierLeagueEvents, filter45GoalLineMarkets } from '@/services/gamma-api';
import { FilteredMarket } from '@/types';
import { MatchCard } from '@/components/features/match-card';
import { useState, useEffect } from 'react';
import { LoadingSkeleton } from '@/components/ui/skeleton';
import { GridView } from '@/components/ui/grid-view';
import { SortingControls } from '@/components/ui/sorting';
import { PriceChart } from '@/components/features/chart/price-chart';
import { fetchMarketPriceHistory, fetchBestAskData } from '@/services/clob-api';
import { convertToUTC7 } from '@/lib/date-utils';
import { Modal } from '@/components/ui/modal';

export default function ClientPage() {
  const [markets, setMarkets] = useState<FilteredMarket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<FilteredMarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState<'date' | 'over' | 'under' | 'bestAskUnder'>('bestAskUnder');
  const [chartLoading, setChartLoading] = useState(false);
  const [overHistory, setOverHistory] = useState<any[]>([]);
  const [underHistory, setUnderHistory] = useState<any[]>([]);
  const [chartError, setChartError] = useState<string | null>(null);
  const [loadingMarketId, setLoadingMarketId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const events = await fetchPremierLeagueEvents();
        let filteredMarkets = filter45GoalLineMarkets(events);
        
        // Fetch best ask data for each market
        const marketsWithBestAsk = await Promise.all(
          filteredMarkets.map(async (market) => {
            try {
              const bestAskData = await fetchBestAskData(market.overTokenId, market.underTokenId);
              return {
                ...market,
                bestAskOverPrice: bestAskData.overBestAskPrice,
                bestAskUnderPrice: bestAskData.underBestAskPrice,
                bestAskOverVolume: bestAskData.overBestAskVolume,
                bestAskUnderVolume: bestAskData.underBestAskVolume,
              };
            } catch (err) {
              console.error('Error fetching best ask data for market:', market.marketId, err);
              // Return market with null values for best ask data
              return {
                ...market,
                bestAskOverPrice: null,
                bestAskUnderPrice: null,
                bestAskOverVolume: null,
                bestAskUnderVolume: null,
              };
            }
          })
        );
        
        setMarkets(marketsWithBestAsk);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Premier League markets. This may be due to CORS restrictions or API unavailability. Please check your network connection and try again.');
        setLoading(false);
        console.error('Error fetching markets:', err);
        
        // Provide more specific debugging info for CORS issues
        if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
          console.error('Debug info: This is likely a CORS error. The Gamma API may not be accessible from this domain.');
          console.error('Possible solutions:');
          console.error('1. Run the app with a proxy server');
          console.error('2. Check if the API endpoint is accessible in your browser');
          console.error('3. Consider using a server-side proxy or Next.js API routes');
        }
      }
    };

    fetchMarkets();
  }, []);

  const handleMarketSelect = async (market: FilteredMarket) => {
    setSelectedMarket(market);
    setChartLoading(true);
    setChartError(null);
    setLoadingMarketId(market.marketId);
    
    try {
      const { overHistory, underHistory } = await fetchMarketPriceHistory(
        market.overTokenId,
        market.underTokenId,
        market.eventCreationDate
      );
      setOverHistory(overHistory.history);
      setUnderHistory(underHistory.history);
    } catch (err) {
      setChartError('Failed to fetch price history. This may be due to API limitations or CORS restrictions.');
      console.error('Error fetching price history:', err);
    } finally {
      setChartLoading(false);
      setLoadingMarketId(null);
    }
  };

  const handleOpenEvent = (market: FilteredMarket) => {
    // Construct the URL by removing "-more-markets" from the event slug
    const eventSlug = market.eventSlug.replace('-more-markets', '');
    const url = `https://polymarket.com/event/${eventSlug}`;
    window.open(url, '_blank');
  };

  const handleSortChange = (sort: 'date' | 'over' | 'under' | 'bestAskUnder') => {
    setSortType(sort);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Re-fetch the markets data
      const events = await fetchPremierLeagueEvents();
      let filteredMarkets = filter45GoalLineMarkets(events);
      
      // Fetch best ask data for each market
      const marketsWithBestAsk = await Promise.all(
        filteredMarkets.map(async (market) => {
          try {
            const bestAskData = await fetchBestAskData(market.overTokenId, market.underTokenId);
            return {
              ...market,
              bestAskOverPrice: bestAskData.overBestAskPrice,
              bestAskUnderPrice: bestAskData.underBestAskPrice,
              bestAskOverVolume: bestAskData.overBestAskVolume,
              bestAskUnderVolume: bestAskData.underBestAskVolume,
            };
          } catch (err) {
            console.error('Error fetching best ask data for market:', market.marketId, err);
            // Return market with null values for best ask data
            return {
              ...market,
              bestAskOverPrice: null,
              bestAskUnderPrice: null,
              bestAskOverVolume: null,
              bestAskUnderVolume: null,
            };
          }
        })
      );
      
      setMarkets(marketsWithBestAsk);
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh Premier League markets. This may be due to CORS restrictions or API unavailability. Please check your network connection and try again.');
      setLoading(false);
      console.error('Error refreshing markets:', err);
      
      // Provide more specific debugging info for CORS issues
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        console.error('Debug info: This is likely a CORS error. The Gamma API may not be accessible from this domain.');
        console.error('Possible solutions:');
        console.error('1. Run the app with a proxy server');
        console.error('2. Check if the API endpoint is accessible in your browser');
        console.error('3. Consider using a server-side proxy or Next.js API routes');
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Sort markets based on selected sort type
  const sortedMarkets = [...markets].sort((a, b) => {
    switch (sortType) {
      case 'date':
        // Convert to UTC+7 for consistent sorting
        const dateA = convertToUTC7(a.gameStartTime);
        const dateB = convertToUTC7(b.gameStartTime);
        return dateA.getTime() - dateB.getTime();
      case 'over':
        return b.currentOverPrice - a.currentOverPrice;
      case 'under':
        return b.currentUnderPrice - a.currentUnderPrice;
      case 'bestAskUnder':
        // Sort by best ask under price (ascending - lowest first)
        return (a.bestAskUnderPrice || 0) - (b.bestAskUnderPrice || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-zinc-700 dark:text-zinc-300">Loading markets...</span>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-700 dark:text-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading markets</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {markets.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">No markets found</h3>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                No Premier League markets with 4.5 goal line found.
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                This could be because there are no active markets or the API is temporarily unavailable.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <SortingControls onSortChange={handleSortChange} />
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {refreshing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.008 8.008 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>
              <GridView>
                {sortedMarkets.map((market) => (
                  <MatchCard 
                    key={market.marketId} 
                    market={market} 
                    onClick={() => handleMarketSelect(market)}
                    isSelected={selectedMarket?.marketId === market.marketId}
                    isLoading={loadingMarketId === market.marketId}
                    onOpenEvent={() => handleOpenEvent(market)}
                  />
                ))}
              </GridView>
              
              {selectedMarket && (
                <Modal
                  isOpen={!!selectedMarket}
                  onClose={() => setSelectedMarket(null)}
                  title={`Price History for ${selectedMarket.eventTitle}`}
                >
                  <PriceChart 
                    overHistory={overHistory}
                    underHistory={underHistory}
                    loading={chartLoading}
                    error={chartError}
                  />
                </Modal>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}