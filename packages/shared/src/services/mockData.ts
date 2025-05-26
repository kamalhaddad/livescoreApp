import { Game, League } from '../types';

const mockGames: Record<League, Game[]> = {
  NFL: [
    {
      id: 'nfl1',
      homeTeam: {
        id: 'ne',
        name: 'New England Patriots',
        abbreviation: 'NE',
        stats: { wins: 8, losses: 9 }
      },
      awayTeam: {
        id: 'buf',
        name: 'Buffalo Bills',
        abbreviation: 'BUF',
        stats: { wins: 11, losses: 6 }
      },
      status: 'live',
      score: { home: 21, away: 24, period: 'Q4' },
      startTime: new Date().toISOString(),
      league: 'NFL',
      venue: 'Gillette Stadium',
      odds: {
        homeWin: 2.5,
        awayWin: 1.65,
        spread: {
          favorite: 'BUF',
          points: 3.5,
          odds: 1.91
        }
      }
    },
    {
      id: 'nfl2',
      homeTeam: {
        id: 'sf',
        name: 'San Francisco 49ers',
        abbreviation: 'SF',
        stats: { wins: 12, losses: 5 }
      },
      awayTeam: {
        id: 'sea',
        name: 'Seattle Seahawks',
        abbreviation: 'SEA',
        stats: { wins: 9, losses: 8 }
      },
      status: 'scheduled',
      score: { home: 0, away: 0 },
      startTime: new Date(Date.now() + 3600000).toISOString(),
      league: 'NFL',
      venue: 'Levi\'s Stadium'
    }
  ],
  NBA: [
    {
      id: 'nba1',
      homeTeam: {
        id: 'lal',
        name: 'Los Angeles Lakers',
        abbreviation: 'LAL',
        stats: { wins: 24, losses: 15 }
      },
      awayTeam: {
        id: 'gsw',
        name: 'Golden State Warriors',
        abbreviation: 'GSW',
        stats: { wins: 22, losses: 17 }
      },
      status: 'live',
      score: { home: 89, away: 92, period: '3rd' },
      startTime: new Date().toISOString(),
      league: 'NBA',
      venue: 'Crypto.com Arena',
      odds: {
        homeWin: 1.85,
        awayWin: 2.1
      }
    }
  ],
  SOCCER: [
    {
      id: 'soc1',
      homeTeam: {
        id: 'mci',
        name: 'Manchester City',
        abbreviation: 'MCI',
        stats: { wins: 15, losses: 3 }
      },
      awayTeam: {
        id: 'liv',
        name: 'Liverpool',
        abbreviation: 'LIV',
        stats: { wins: 14, losses: 4 }
      },
      status: 'finished',
      score: { home: 3, away: 2 },
      startTime: new Date(Date.now() - 3600000).toISOString(),
      league: 'SOCCER',
      venue: 'Etihad Stadium'
    },
    {
      id: 'soc2',
      homeTeam: {
        id: 'ars',
        name: 'Arsenal',
        abbreviation: 'ARS',
        stats: { wins: 16, losses: 2 }
      },
      awayTeam: {
        id: 'che',
        name: 'Chelsea',
        abbreviation: 'CHE',
        stats: { wins: 10, losses: 8 }
      },
      status: 'scheduled',
      score: { home: 0, away: 0 },
      startTime: new Date(Date.now() + 7200000).toISOString(),
      league: 'SOCCER',
      venue: 'Emirates Stadium',
      odds: {
        homeWin: 1.75,
        awayWin: 2.2,
        draw: 3.5
      }
    }
  ]
};

export const getMockGames = (league: League): Promise<Game[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGames[league]);
    }, 1000); // Simulate network delay
  });
}; 