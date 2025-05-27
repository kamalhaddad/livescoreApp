import { useOddsApi } from '../hooks/useOddsApi';
import { useState, useEffect } from 'react';
import { GameCard } from '@livescore/shared';
import type { Game as SharedGame } from '@livescore/shared/dist/types';
import type { Game as OddsGame, ScoreResponse } from '../services/odds-api/types';

// Helper function to create a team object from a team name
const createTeamObject = (teamName: string) => ({
  id: teamName.toLowerCase().replace(/\s+/g, '-'),
  name: teamName,
  abbreviation: teamName.split(' ').pop()?.toUpperCase() || '',
});

// Helper function to map API status to our GameStatus type
const mapGameStatus = (status: ScoreResponse['status']): SharedGame['status'] => {
  switch (status) {
    case 'in_progress':
      return 'live';
    case 'ended':
      return 'finished';
    case 'scheduled':
    default:
      return 'scheduled';
  }
};

// Mapper function to convert API data to SharedGame
const mapToSharedGame = (oddsGame: OddsGame, scoresData: ScoreResponse[]): SharedGame => {
  const homeOdds = oddsGame.bookmakers?.[0]?.markets?.[0]?.outcomes?.find(o => o.name === oddsGame.home_team)?.price;
  const awayOdds = oddsGame.bookmakers?.[0]?.markets?.[0]?.outcomes?.find(o => o.name === oddsGame.away_team)?.price;
  
  // Find matching score data
  const scoreInfo = scoresData?.find((score) => 
    score.home_team === oddsGame.home_team && score.away_team === oddsGame.away_team
  );

  return {
    id: oddsGame.id,
    homeTeam: createTeamObject(oddsGame.home_team),
    awayTeam: createTeamObject(oddsGame.away_team),
    status: scoreInfo ? mapGameStatus(scoreInfo.status) : 'scheduled',
    score: {
      home: scoreInfo?.scores?.home || 0,
      away: scoreInfo?.scores?.away || 0,
      period: scoreInfo?.period,
    },
    startTime: oddsGame.commence_time,
    league: oddsGame.sport_title as any,
    odds: homeOdds && awayOdds ? {
      homeWin: homeOdds,
      awayWin: awayOdds,
    } : undefined,
  };
};

export function LiveScores() {
  const { sports, games: oddsGames, scores: scoresData, loading, error, fetchOdds, fetchScores } = useOddsApi();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [liveGames, setLiveGames] = useState<SharedGame[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (selectedSport && !isFetching) {
      const fetchData = async () => {
        try {
          setIsFetching(true);
          setIsPolling(true);
          setLastError(null);
          await Promise.all([
            fetchOdds(selectedSport),
            fetchScores(selectedSport),
          ]);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Error fetching initial data:', errorMessage);
          setLastError(`Failed to fetch data: ${errorMessage}`);
          setIsPolling(false);
        } finally {
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [selectedSport, fetchOdds, fetchScores, isFetching]);

  // Set up polling for live games
  useEffect(() => {
    if (!selectedSport || !isPolling || isFetching) return;

    const pollInterval = setInterval(async () => {
      try {
        setIsFetching(true);
        await Promise.all([
          fetchOdds(selectedSport),
          fetchScores(selectedSport),
        ]);
        setLastError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error polling data:', errorMessage);
        setLastError(`Failed to update data: ${errorMessage}`);
        setIsPolling(false);
        clearInterval(pollInterval);
      } finally {
        setIsFetching(false);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [selectedSport, fetchOdds, fetchScores, isPolling, isFetching]);

  // Transform games data whenever odds or scores data changes
  useEffect(() => {
    try {
      const transformedGames = oddsGames.map(game => mapToSharedGame(game, scoresData));
      setLiveGames(transformedGames);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error transforming games data:', errorMessage);
      setLastError(`Failed to process game data: ${errorMessage}`);
      setIsPolling(false);
    }
  }, [oddsGames, scoresData]);

  if (loading && !lastError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || lastError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center max-w-2xl mx-auto p-4">
          <p className="text-xl font-semibold mb-4">Error: {error || lastError}</p>
          <div className="text-sm text-gray-600 mb-4">
            <p>This could be due to:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Missing or invalid API key</li>
              <li>Network connectivity issues</li>
              <li>API rate limiting</li>
              <li>Invalid sport selection</li>
            </ul>
          </div>
          <button 
            onClick={() => {
              setLastError(null);
              setIsPolling(true);
              if (selectedSport) {
                Promise.all([
                  fetchOdds(selectedSport),
                  fetchScores(selectedSport)
                ]).catch(error => {
                  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                  setLastError(`Retry failed: ${errorMessage}`);
                  setIsPolling(false);
                });
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Live Scores</h1>
        <div className="flex flex-wrap gap-3">
          {sports.map((sport) => (
            <button
              key={sport.key}
              onClick={() => setSelectedSport(sport.key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedSport === sport.key
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {sport.title}
            </button>
          ))}
        </div>
      </div>

      {selectedSport && liveGames.length > 0 && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {liveGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                platform="web"
                showOdds={true}
                onPress={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {selectedSport && liveGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No live games available for this sport at the moment.</p>
        </div>
      )}
    </div>
  );
} 