'use client';

import { useState, useEffect } from 'react';
import { FilteredMarket, TeamStats } from '@/types';
import { fetchPremierLeagueEvents, filter45GoalLineMarkets } from '@/services/gamma-api';
import { computeAllTeamStats } from '@/services/match-history';
import { TeamStatsCard } from '@/components/features/team-stats-card';
import { TeamHistoryModal } from '@/components/features/team-history-modal';
import { GridView } from '@/components/ui/grid-view';

type SortType = 'name' | 'over45' | 'matches';

export default function ClientPage() {
  const [teams, setTeams] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats | null>(null);
  const [sortType, setSortType] = useState<SortType>('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[Teams] Starting data fetch...');

        // Fetch current markets from Gamma API
        console.log('[Teams] Fetching markets...');
        const events = await fetchPremierLeagueEvents();
        console.log('[Teams] Got events:', events.length);

        const markets = filter45GoalLineMarkets(events);
        console.log('[Teams] Filtered markets:', markets.length);

        // Compute team stats
        console.log('[Teams] Computing team stats...');
        const teamStatsList = await computeAllTeamStats(markets);
        console.log('[Teams] Team stats computed:', teamStatsList.length);

        setTeams(teamStatsList);
        setLoading(false);
      } catch (err) {
        console.error('[Teams] Error fetching team data:', err);
        console.error('[Teams] Error stack:', err instanceof Error ? err.stack : 'No stack');
        setError(`Failed to load team data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTeamClick = (team: TeamStats) => {
    setSelectedTeam(team);
  };

  // Sort teams based on selected sort type
  const sortedTeams = [...teams].sort((a, b) => {
    switch (sortType) {
      case 'name':
        return a.teamName.localeCompare(b.teamName);
      case 'over45':
        return b.over45Percentage - a.over45Percentage;
      case 'matches':
        return b.matchesPlayed - a.matchesPlayed;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-zinc-700 dark:text-zinc-300">Loading team data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-700 dark:text-red-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading team data</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">No team data found</h3>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          No teams with match history data are currently available.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Premier League Team Stats</h1>
        <p className="text-zinc-400">Historical Over 4.5 goal statistics for EPL teams</p>
      </div>

      {/* Sorting Controls */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Sort by:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSortType('name')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              sortType === 'name'
                ? 'text-white'
                : ''
            }`}
            style={{
              background: sortType === 'name' ? 'var(--brand-primary)' : 'var(--background-tertiary)',
              color: sortType === 'name' ? 'white' : 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            Name
          </button>
          <button
            onClick={() => setSortType('over45')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              sortType === 'over45'
                ? 'text-white'
                : ''
            }`}
            style={{
              background: sortType === 'over45' ? 'var(--brand-primary)' : 'var(--background-tertiary)',
              color: sortType === 'over45' ? 'white' : 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            Over 4.5%
          </button>
          <button
            onClick={() => setSortType('matches')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              sortType === 'matches'
                ? 'text-white'
                : ''
            }`}
            style={{
              background: sortType === 'matches' ? 'var(--brand-primary)' : 'var(--background-tertiary)',
              color: sortType === 'matches' ? 'white' : 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            Total Matches
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <GridView>
        {sortedTeams.map((team) => (
          <TeamStatsCard
            key={team.teamName}
            team={team}
            onClick={() => handleTeamClick(team)}
          />
        ))}
      </GridView>

      {/* Team History Modal */}
      <TeamHistoryModal
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
