/**
 * Team name normalizer for mapping between Gamma API and OpenFootball formats
 */

// Mapping from Gamma API team names to OpenFootball format
const TEAM_NAME_MAP: Record<string, string> = {
  "Liverpool": "Liverpool FC",
  "Man City": "Manchester City FC",
  "Manchester City": "Manchester City FC",
  "Spurs": "Tottenham Hotspur FC",
  "Tottenham": "Tottenham Hotspur FC",
  "Man Utd": "Manchester United FC",
  "Manchester United": "Manchester United FC",
  "Newcastle": "Newcastle United FC",
  "Brighton": "Brighton & Hove Albion FC",
  "Wolves": "Wolverhampton Wanderers FC",
  "Arsenal": "Arsenal FC",
  "Chelsea": "Chelsea FC",
  "Aston Villa": "Aston Villa FC",
  "Fulham": "Fulham FC",
  "Brentford": "Brentford FC",
  "West Ham": "West Ham United FC",
  "West Ham United": "West Ham United FC",
  "Crystal Palace": "Crystal Palace FC",
  "Everton": "Everton FC",
  "Leicester": "Leicester City FC",
  "Leicester City": "Leicester City FC",
  "Nottingham Forest": "Nottingham Forest FC",
  "Nott'm Forest": "Nottingham Forest FC",
  "Southampton": "Southampton FC",
  "Bournemouth": "AFC Bournemouth",
  "AFC Bournemouth": "AFC Bournemouth",
  "Ipswich": "Ipswich Town FC",
  "Ipswich Town": "Ipswich Town FC",
  "Leeds": "Leeds United FC",
  "Leeds United": "Leeds United FC",
  "Burnley": "Burnley FC",
  "Sheffield United": "Sheffield United FC",
  "Sheffield Utd": "Sheffield United FC",
  "Luton": "Luton Town FC",
  "Luton Town": "Luton Town FC",
};

// Reverse mapping for display names
const OPENFOOTBALL_TO_DISPLAY: Record<string, string> = {
  "Liverpool FC": "Liverpool",
  "Manchester City FC": "Manchester City",
  "Tottenham Hotspur FC": "Tottenham",
  "Manchester United FC": "Manchester United",
  "Newcastle United FC": "Newcastle",
  "Brighton & Hove Albion FC": "Brighton",
  "Wolverhampton Wanderers FC": "Wolves",
  "Arsenal FC": "Arsenal",
  "Chelsea FC": "Chelsea",
  "Aston Villa FC": "Aston Villa",
  "Fulham FC": "Fulham",
  "Brentford FC": "Brentford",
  "West Ham United FC": "West Ham",
  "Crystal Palace FC": "Crystal Palace",
  "Everton FC": "Everton",
  "Leicester City FC": "Leicester",
  "Nottingham Forest FC": "Nottingham Forest",
  "Southampton FC": "Southampton",
  "AFC Bournemouth": "Bournemouth",
  "Ipswich Town FC": "Ipswich",
  "Leeds United FC": "Leeds",
  "Burnley FC": "Burnley",
  "Sheffield United FC": "Sheffield United",
  "Luton Town FC": "Luton",
};

/**
 * Normalizes team name from Gamma API format to OpenFootball format
 * @param gammaName - Team name from Gamma API
 * @returns OpenFootball formatted team name
 */
export function normalizeToOpenFootball(gammaName: string): string {
  const normalized = TEAM_NAME_MAP[gammaName];
  if (normalized) {
    return normalized;
  }

  // If no direct mapping, try to match by checking if gammaName ends with FC
  if (gammaName.endsWith(' FC')) {
    return gammaName;
  }

  // Default: append FC
  return `${gammaName} FC`;
}

/**
 * Normalizes team name from OpenFootball format to display format
 * @param openfootballName - Team name from OpenFootball
 * @returns Display-friendly team name
 */
export function normalizeToDisplay(openfootballName: string): string {
  const display = OPENFOOTBALL_TO_DISPLAY[openfootballName];
  if (display) {
    return display;
  }

  // Default: remove FC suffix
  return openfootballName.replace(/ FC$/, '');
}

/**
 * Extracts team names from event title
 * Handles formats like:
 * - "Liverpool vs Manchester City"
 * - "Man Utd @ Arsenal"
 * - "Chelsea v Brighton"
 *
 * @param eventTitle - Event title from Gamma API
 * @returns Object with home and away team names (OpenFootball format)
 */
export function extractTeamNamesFromTitle(eventTitle: string): { home: string; away: string } | null {
  // Common separators: vs, v, @, -
  const separators = [' vs ', ' v ', ' @ ', ' - '];

  for (const separator of separators) {
    if (eventTitle.includes(separator)) {
      const parts = eventTitle.split(separator);
      if (parts.length === 2) {
        const homeTeam = parts[0].trim();
        const awayTeam = parts[1].trim();

        return {
          home: normalizeToOpenFootball(homeTeam),
          away: normalizeToOpenFootball(awayTeam),
        };
      }
    }
  }

  return null;
}

/**
 * Gets all unique team names from OpenFootball mapping
 * @returns Array of OpenFootball team names
 */
export function getAllOpenFootballTeams(): string[] {
  return Array.from(new Set(Object.values(TEAM_NAME_MAP)));
}
