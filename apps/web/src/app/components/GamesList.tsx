import React, { useEffect, useState } from 'react';
import { Game, League, GameCard, SportsAPI } from '@livescore/shared';

interface GamesListProps {
  league: League;
}

export const GamesList: React.FC<GamesListProps> = ({ league }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const gamesData = await SportsAPI.getLiveGames(league);
        setGames(gamesData);
        setError(null);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
    // Set up polling for live updates
    const interval = setInterval(fetchGames, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [league]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No games scheduled at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          platform="web"
          onPress={() => console.log('Game clicked:', game.id)}
        />
      ))}
    </div>
  );
}; 