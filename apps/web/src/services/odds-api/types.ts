export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
  last_update: string;
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface ScoreResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed: boolean;
  home_team: string;
  away_team: string;
  scores: {
    home: number;
    away: number;
  };
  last_update: string;
  status: 'scheduled' | 'in_progress' | 'ended';
  period?: string;
}

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export type OddsFormat = 'decimal' | 'american';

export interface OddsApiConfig {
  apiKey: string;
  baseUrl: string;
  oddsFormat: OddsFormat;
} 