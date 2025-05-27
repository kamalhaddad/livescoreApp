import { useEffect, useState, useCallback } from 'react';
import { Game, Sport, ScoreResponse } from '../services/odds-api/types';
import { OddsApiService } from '../services/odds-api/odds-api.service';
import { oddsApiConfig } from '../config/odds-api.config';

const oddsApiService = new OddsApiService(oddsApiConfig);

export function useOddsApi() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<ScoreResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleApiError = useCallback((err: unknown, operation: string): string => {
    console.error(`Error during ${operation}:`, err);
    
    if (err instanceof Error) {
      // Check for specific error types
      if (err.message.includes('API key')) {
        return `API Key Error: ${err.message}`;
      }
      if (err.message.includes('429')) {
        return 'Rate limit exceeded. Please try again in a moment.';
      }
      if (err.message.includes('404')) {
        return 'The requested sport data is not available.';
      }
      return err.message;
    }
    
    return `Failed to ${operation}`;
  }, []);

  const fetchSports = useCallback(async () => {
    if (!isInitialized) {
      try {
        setLoading(true);
        setError(null);
        const data = await oddsApiService.getSports();
        setSports(data);
        setIsInitialized(true);
        return data;
      } catch (err) {
        const errorMessage = handleApiError(err, 'fetch sports');
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    }
    return sports;
  }, [sports, isInitialized, handleApiError]);

  const fetchOdds = useCallback(async (sportKey: string) => {
    if (!sportKey) return [];
    
    try {
      setError(null);
      const data = await oddsApiService.getOdds(sportKey);
      setGames(data);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err, 'fetch odds');
      setError(errorMessage);
      throw err; // Propagate error to component for handling
    }
  }, [handleApiError]);

  const fetchScores = useCallback(async (sportKey: string) => {
    if (!sportKey) return [];
    
    try {
      setError(null);
      const data = await oddsApiService.getScores(sportKey);
      setScores(data);
      return data;
    } catch (err) {
      const errorMessage = handleApiError(err, 'fetch scores');
      setError(errorMessage);
      throw err; // Propagate error to component for handling
    }
  }, [handleApiError]);

  // Only fetch sports list once on initial mount
  useEffect(() => {
    if (!isInitialized) {
      fetchSports().catch(err => {
        const errorMessage = handleApiError(err, 'initialize sports data');
        setError(errorMessage);
      });
    }
  }, [isInitialized, fetchSports, handleApiError]);

  return {
    sports,
    games,
    scores,
    loading,
    error,
    fetchOdds,
    fetchScores,
  };
} 