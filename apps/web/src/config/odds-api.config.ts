import { OddsApiConfig } from '../services/odds-api/types';

export const oddsApiConfig: OddsApiConfig = {
  apiKey: process.env.NEXT_PUBLIC_ODDS_API_KEY || '',
  baseUrl: 'https://api.the-odds-api.com',
  oddsFormat: 'decimal',
}; 