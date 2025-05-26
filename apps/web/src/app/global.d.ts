declare module '@livescore/shared' {
  import { FC } from 'react';
  import { Game } from '@livescore/shared/dist/types';

  interface GameCardProps {
    game: Game;
    onPress?: () => void;
    showOdds?: boolean;
    platform?: 'web' | 'native';
  }

  export const GameCard: FC<GameCardProps>;
}

declare module '@livescore/shared/dist/types' {
  export interface Game {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    status: GameStatus;
    score: Score;
    startTime: string;
    league: League;
    venue?: string;
    odds?: BettingOdds;
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

  export interface BettingOdds {
    homeWin: number;
    awayWin: number;
    draw?: number;
    spread?: {
      favorite: string;
      points: number;
      odds: number;
    };
    overUnder?: {
      total: number;
      over: number;
      under: number;
    };
  }

  export type GameStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';
  export type League = 'NFL' | 'NBA' | 'SOCCER';
} 