import { NextApiRequest, NextApiResponse } from 'next';
import { SportsAPI } from '@livescore/shared/src/services/api';
import { Game } from '@livescore/shared/src/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: {
    nfl: Game[] | null;
    nba: Game[] | null;
    soccer: Game[] | null;
    odds: Record<string, any> | null;
    errors: string[];
  } = {
    nfl: null,
    nba: null,
    soccer: null,
    odds: null,
    errors: []
  };

  try {
    results.nfl = await SportsAPI.getLiveGames('NFL');
  } catch (error: any) {
    results.errors.push(`NFL Error: ${error.message}`);
  }

  try {
    results.nba = await SportsAPI.getLiveGames('NBA');
  } catch (error: any) {
    results.errors.push(`NBA Error: ${error.message}`);
  }

  try {
    results.soccer = await SportsAPI.getLiveGames('SOCCER');
  } catch (error: any) {
    results.errors.push(`Soccer Error: ${error.message}`);
  }

  try {
    results.odds = await SportsAPI.getOdds('NFL');
  } catch (error: any) {
    results.errors.push(`Odds Error: ${error.message}`);
  }

  res.status(200).json(results);
} 