import type { GameStatus } from '../components/FilterBar';

export type { GameStatus };
export type { SortOption } from '../components/FilterBar';

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: GameStatus;
  score: Score;
  startTime: string;
  league: League;
  venue?: string;
  odds?: Odds;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  logo?: string;
  stats?: TeamStats;
}

export interface Score {
  home: number;
  away: number;
  period?: string | number;
  display?: string;
}

export interface TeamStats {
  wins: number;
  losses: number;
  ties?: number;
  points?: number;
  rank?: number;
}

export interface Odds {
  homeWin: number;
  awayWin: number;
  draw?: number;
  spread?: {
    favorite: string;
    points: number;
    odds: number;
  };
}

export type League = 'NFL' | 'NBA' | 'SOCCER';

export const filterGames = (
  games: Game[],
  status: GameStatus,
  searchQuery: string
): Game[] => {
  return games
    .filter((game) => {
      // Filter by status
      if (status !== 'all' && game.status !== status) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          game.homeTeam.name.toLowerCase().includes(query) ||
          game.awayTeam.name.toLowerCase().includes(query) ||
          game.league.toLowerCase().includes(query)
        );
      }

      return true;
    });
};

export const sortGames = (games: Game[], sortBy: 'time' | 'league' | 'team'): Game[] => {
  return [...games].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      case 'league':
        return a.league.localeCompare(b.league);
      case 'team':
        return a.homeTeam.name.localeCompare(b.homeTeam.name);
      default:
        return 0;
    }
  });
}; 