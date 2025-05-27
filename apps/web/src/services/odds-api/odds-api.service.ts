import { Game, OddsApiConfig, Sport, ScoreResponse } from './types';

const SUPPORTED_SPORTS = [
  { 
    key: 'americanfootball_nfl',
    group: 'American Football',
    title: 'NFL',
    description: 'US National Football League',
    active: true,
    has_outrights: false
  },
  {
    key: 'basketball_nba',
    group: 'Basketball',
    title: 'NBA',
    description: 'US National Basketball Association',
    active: true,
    has_outrights: false
  },
  {
    key: 'soccer_epl',
    group: 'Soccer',
    title: 'EPL',
    description: 'English Premier League',
    active: true,
    has_outrights: false
  }
];

export class OddsApiService {
  private config: OddsApiConfig;
  private apiKeyError: string | null = null;
  private cachedSports: Sport[] | null = null;

  constructor(config: OddsApiConfig) {
    this.config = config;
    
    if (!config.apiKey || config.apiKey.trim() === '') {
      this.apiKeyError = 'API key is missing. Please set NEXT_PUBLIC_ODDS_API_KEY in your environment.';
      console.warn(this.apiKeyError);
    } else if (!this.isValidApiKey(config.apiKey)) {
      this.apiKeyError = 'Invalid API key format. API key should be a non-empty string.';
      console.error(this.apiKeyError);
    }
  }

  private isValidApiKey(apiKey: string): boolean {
    return typeof apiKey === 'string' && apiKey.trim().length > 0;
  }

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (this.apiKeyError) {
      throw new Error(this.apiKeyError);
    }

    if (!endpoint) {
      throw new Error('Endpoint is required');
    }

    const queryParams = new URLSearchParams({
      api_key: this.config.apiKey,
      ...params,
    });

    const response = await fetch(`${this.config.baseUrl}${endpoint}?${queryParams}`);

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        this.apiKeyError = 'Invalid API key. Please check your API key configuration.';
        throw new Error(this.apiKeyError);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ''
        }`
      );
    }

    return response.json();
  }

  async getSports(): Promise<Sport[]> {
    // Return cached sports if available
    if (this.cachedSports) {
      return this.cachedSports;
    }

    try {
      const sports = await this.fetchFromApi<Sport[]>('/v4/sports');
      // Only cache active sports that we support
      this.cachedSports = sports.filter(sport => 
        sport.active && SUPPORTED_SPORTS.some(s => s.key === sport.key)
      );
      return this.cachedSports;
    } catch (error) {
      // Fallback to supported sports list if API fails
      this.cachedSports = SUPPORTED_SPORTS;
      throw error;
    }
  }

  async getOdds(sportKey: string): Promise<Game[]> {
    if (!sportKey) {
      throw new Error('Sport key is required');
    }

    return this.fetchFromApi<Game[]>(`/v4/sports/${sportKey}/odds`, {
      regions: 'us',
      markets: 'h2h,spreads,totals',
      oddsFormat: this.config.oddsFormat,
    });
  }

  async getScores(sportKey: string): Promise<ScoreResponse[]> {
    if (!sportKey) {
      throw new Error('Sport key is required');
    }

    return this.fetchFromApi<ScoreResponse[]>(`/v4/sports/${sportKey}/scores`, {
      daysFrom: '1',
      completed: 'false',
    });
  }
} 