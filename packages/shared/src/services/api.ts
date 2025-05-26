import { Game, League } from '../types';
import { getMockGames } from './mockData';

// API configuration - these should be moved to environment variables
const API_KEYS = {
  NFL: process.env.NFL_API_KEY || '',
  NBA: process.env.NBA_API_KEY || '',
  SOCCER: process.env.SOCCER_API_KEY || '',
  ODDS: process.env.ODDS_API_KEY || '',
};

const API_ENDPOINTS = {
  NFL: 'https://api.sportradar.us/nfl/official/trial/v7/en',
  NBA: 'https://api.sportradar.us/nba/trial/v7/en',
  SOCCER: 'https://api.football-data.org/v4',
  ODDS: 'https://api.the-odds-api.com/v4/sports',
};

export class SportsAPI {
  static async getLiveGames(league: League): Promise<Game[]> {
    // Temporarily use mock data
    return getMockGames(league);
    
    // Real implementation (commented out for now)
    /*
    try {
      switch (league) {
        case 'NFL':
          return await this.getNFLGames();
        case 'NBA':
          return await this.getNBAGames();
        case 'SOCCER':
          return await this.getSoccerGames();
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error fetching ${league} games:`, error);
      return [];
    }
    */
  }

  private static async getNFLGames(): Promise<Game[]> {
    const response = await fetch(
      `${API_ENDPOINTS.NFL}/games/2024/REG/schedule.json?api_key=${API_KEYS.NFL}`
    );
    const data = await response.json();
    return this.transformNFLData(data);
  }

  private static async getNBAGames(): Promise<Game[]> {
    const response = await fetch(
      `${API_ENDPOINTS.NBA}/games/2024/schedule.json?api_key=${API_KEYS.NBA}`
    );
    const data = await response.json();
    return this.transformNBAData(data);
  }

  private static async getSoccerGames(): Promise<Game[]> {
    const response = await fetch(`${API_ENDPOINTS.SOCCER}/matches`, {
      headers: {
        'X-Auth-Token': API_KEYS.SOCCER,
      },
    });
    const data = await response.json();
    return this.transformSoccerData(data);
  }

  static async getOdds(league: League): Promise<Record<string, any>> {
    const sportKey = this.getSportKey(league);
    const response = await fetch(
      `${API_ENDPOINTS.ODDS}/${sportKey}/odds?apiKey=${API_KEYS.ODDS}&regions=us&markets=h2h,spreads`
    );
    return response.json();
  }

  private static getSportKey(league: League): string {
    switch (league) {
      case 'NFL':
        return 'americanfootball_nfl';
      case 'NBA':
        return 'basketball_nba';
      case 'SOCCER':
        return 'soccer_epl'; // Default to English Premier League
      default:
        return '';
    }
  }

  private static transformNFLData(data: any): Game[] {
    // Transform NFL API response to our Game interface
    return [];
  }

  private static transformNBAData(data: any): Game[] {
    // Transform NBA API response to our Game interface
    return [];
  }

  private static transformSoccerData(data: any): Game[] {
    // Transform Soccer API response to our Game interface
    return [];
  }
} 