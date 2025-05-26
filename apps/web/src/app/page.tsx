'use client';

import { useState } from 'react';
import { GameList } from './components/GameList';
import type { Game, GameStatus } from '@livescore/shared/src/types';

// Sample data for demonstration
const initialGames: Game[] = [
  {
    id: '1',
    homeTeam: { id: '1', name: 'Manchester United', abbreviation: 'MUN' },
    awayTeam: { id: '2', name: 'Liverpool', abbreviation: 'LIV' },
    status: 'live' as GameStatus,
    score: { home: 2, away: 1 },
    startTime: '2024-03-20T15:00:00Z',
    league: 'SOCCER',
  },
  {
    id: '2',
    homeTeam: { id: '3', name: 'Lakers', abbreviation: 'LAL' },
    awayTeam: { id: '4', name: 'Warriors', abbreviation: 'GSW' },
    status: 'scheduled' as GameStatus,
    score: { home: 0, away: 0 },
    startTime: '2024-03-20T19:30:00Z',
    league: 'NBA',
  },
  {
    id: '3',
    homeTeam: { id: '5', name: 'Arsenal', abbreviation: 'ARS' },
    awayTeam: { id: '6', name: 'Chelsea', abbreviation: 'CHE' },
    status: 'finished' as GameStatus,
    score: { home: 3, away: 1 },
    startTime: '2024-03-20T12:30:00Z',
    league: 'SOCCER',
  },
];

export default function Home() {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update game scores and statuses
      setGames(prevGames => 
        prevGames.map(game => {
          if (game.status === 'live') {
            return {
              ...game,
              score: {
                home: game.score.home + Math.floor(Math.random() * 2),
                away: game.score.away + Math.floor(Math.random() * 2),
              },
            };
          }
          if (game.status === 'scheduled' && Math.random() > 0.5) {
            return {
              ...game,
              status: 'live' as GameStatus,
              score: { home: 0, away: 0 },
            };
          }
          return game;
        })
      );
    } catch (error) {
      console.error('Error refreshing games:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <GameList 
        games={games}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </main>
  );
}
