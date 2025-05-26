'use client';

import React, { useState, useMemo } from 'react';
import { FilterBar } from '@livescore/shared/src/components/FilterBar';
import { GameCard } from '@livescore/shared/src/components/GameCard';
import type { Game, GameStatus, SortOption } from '@livescore/shared/src/types';
import { filterGames, sortGames } from '@livescore/shared/src/types';

interface GameListProps {
  games: Game[];
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export const GameList: React.FC<GameListProps> = ({ games, onRefresh, isRefreshing = false }) => {
  const [selectedStatus, setSelectedStatus] = useState<GameStatus>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('time');
  const [searchQuery, setSearchQuery] = useState('');
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = React.useRef(0);
  const PULL_THRESHOLD = 100;

  const filteredAndSortedGames = useMemo(() => {
    const filtered = filterGames(games, selectedStatus, searchQuery);
    return sortGames(filtered, selectedSort);
  }, [games, selectedStatus, selectedSort, searchQuery]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onRefresh) return;
    touchStartY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRefresh || !isPulling) return;
    const touchY = e.touches[0].clientY;
    const scrollTop = window.scrollY;
    
    if (scrollTop === 0) {
      const delta = touchY - touchStartY.current;
      if (delta > 0) {
        e.preventDefault();
        setPullDistance(Math.min(delta * 0.5, PULL_THRESHOLD));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!onRefresh || !isPulling) return;
    setIsPulling(false);
    
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      await onRefresh();
    }
    setPullDistance(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FilterBar
        selectedStatus={selectedStatus}
        selectedSort={selectedSort}
        searchQuery={searchQuery}
        onStatusChange={setSelectedStatus}
        onSortChange={setSelectedSort}
        onSearchChange={setSearchQuery}
      />
      
      <div 
        className="mt-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {pullDistance > 0 && (
          <div className="absolute left-0 right-0 flex justify-center items-center" style={{ top: -40 }}>
            <div className="text-blue-500 text-sm">
              {pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          </div>
        )}
        {isRefreshing && (
          <div className="absolute left-0 right-0 flex justify-center items-center" style={{ top: -40 }}>
            <div className="text-blue-500 text-sm">Refreshing...</div>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              platform="web"
              onPress={() => console.log('Game clicked:', game.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 