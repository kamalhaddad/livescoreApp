'use client';

import React, { useState, useMemo } from 'react';
import { FilterBar, Game, filterGames, sortGames, GameStatus, SortOption, GameCard } from '@livescore/shared';

interface GameListProps {
  games: Game[];
}

export const GameList: React.FC<GameListProps> = ({ games }) => {
  const [selectedStatus, setSelectedStatus] = useState<GameStatus>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('time');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedGames = useMemo(() => {
    const filtered = filterGames(games, selectedStatus, searchQuery);
    return sortGames(filtered, selectedSort);
  }, [games, selectedStatus, selectedSort, searchQuery]);

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
      
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}; 