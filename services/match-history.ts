import { MatchResult, TeamStats, FilteredMarket } from '@/types';
import { extractTeamNamesFromTitle, normalizeToOpenFootball } from '@/lib/team-name-normalizer';

const MATCH_HISTORY_API_URL = '/api/match-history';

/**
 * Raw match data structure from OpenFootball JSON
 */
interface RawMatch {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: {
    ft?: [number, number];
  };
}

interface RawSeasonData {
  name: string;
  matches: RawMatch[];
}

/**
 * Fetches match history from proxy API
 */
export async function fetchMatchHistory(): Promise<MatchResult[]> {
  try {
    const response = await fetch(MATCH_HISTORY_API_URL);

    if (!response.ok) {
      throw new Error(`Match history API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const allMatches: MatchResult[] = [];

    // Parse 2024-25 season
    if (data['2024-25']) {
      const matches2024 = parseSeasonMatches(data['2024-25'], '2024-25');
      allMatches.push(...matches2024);
    }

    // Parse 2025-26 season
    if (data['2025-26']) {
      const matches2025 = parseSeasonMatches(data['2025-26'], '2025-26');
      allMatches.push(...matches2025);
    }

    // Parse 2026-27 season
    if (data['2026-27']) {
      const matches2026 = parseSeasonMatches(data['2026-27'], '2026-27');
      allMatches.push(...matches2026);
    }

    return allMatches;
  } catch (error) {
    console.error('Error fetching match history:', error);
    throw error;
  }
}

/**
 * Parses raw season data into MatchResult objects
 */
export function parseSeasonMatches(rawData: RawSeasonData, season: string): MatchResult[] {
  const matches: MatchResult[] = [];

  if (!rawData || !rawData.matches) {
    return matches;
  }

  for (const match of rawData.matches) {
    // Only include matches with final scores
    if (match.score && match.score.ft) {
      const totalGoals = match.score.ft[0] + match.score.ft[1];
      const isOver45 = totalGoals > 4.5;

      matches.push({
        round: match.round,
        date: match.date,
        time: match.time || '00:00',
        team1: match.team1,
        team2: match.team2,
        score: {
          ft: match.score.ft,
        },
        totalGoals,
        isOver45,
        season,
      });
    }
  }

  return matches;
}

/**
 * Computes team statistics from match history
 */
export function computeTeamStats(matches: MatchResult[], teamName: string): TeamStats {
  // Filter matches for this team (either home or away)
  const teamMatches = matches.filter(
    (match) => match.team1 === teamName || match.team2 === teamName
  );

  // Sort by date (newest first)
  teamMatches.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Calculate Over 4.5 stats
  const over45Count = teamMatches.filter((match) => match.isOver45).length;
  const matchesPlayed = teamMatches.length;
  const over45Percentage = matchesPlayed > 0 ? (over45Count / matchesPlayed) * 100 : 0;

  // Get last 5 matches
  const last5Matches = teamMatches.slice(0, 5);

  return {
    teamName,
    matchesPlayed,
    over45Count,
    over45Percentage,
    last5Matches,
    allMatches: teamMatches,
  };
}

/**
 * Extracts unique team names from current markets
 */
export function extractUniqueTeams(markets: FilteredMarket[]): string[] {
  const teamSet = new Set<string>();

  for (const market of markets) {
    const teams = extractTeamNamesFromTitle(market.eventTitle);
    if (teams) {
      teamSet.add(teams.home);
      teamSet.add(teams.away);
    }
  }

  return Array.from(teamSet).sort();
}

/**
 * Extracts unique team names from match history for a specific season
 */
export function extractTeamsFromMatches(matches: MatchResult[], season?: string): string[] {
  const teamSet = new Set<string>();

  for (const match of matches) {
    // Filter by season if specified
    if (season && match.season !== season) {
      continue;
    }

    teamSet.add(match.team1);
    teamSet.add(match.team2);
  }

  return Array.from(teamSet).sort();
}

/**
 * Computes stats for all teams from markets and match history
 */
export async function computeAllTeamStats(markets: FilteredMarket[]): Promise<TeamStats[]> {
  // Fetch match history
  const matchHistory = await fetchMatchHistory();

  // Extract unique teams from match history (prioritize 2025-26 season, fallback to all seasons)
  const teamsFrom2025 = extractTeamsFromMatches(matchHistory, '2025-26');
  const teamsFromAllSeasons = extractTeamsFromMatches(matchHistory);

  // Use 2025-26 teams if available, otherwise use all teams
  const teams = teamsFrom2025.length > 0 ? teamsFrom2025 : teamsFromAllSeasons;

  // Compute stats for each team
  const teamStatsList: TeamStats[] = [];

  for (const team of teams) {
    const stats = computeTeamStats(matchHistory, team);

    // Only include teams with at least one match
    if (stats.matchesPlayed > 0) {
      teamStatsList.push(stats);
    }
  }

  return teamStatsList;
}
