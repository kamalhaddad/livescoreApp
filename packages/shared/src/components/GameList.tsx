import React, { useCallback, useRef, useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { GameCard } from './GameCard';
import { GameCardSkeleton } from './GameCardSkeleton';
import { Game } from '../types';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';

interface GameListProps {
  games: Game[];
  isLoading?: boolean;
  onGamePress?: (game: Game) => void;
  showOdds?: boolean;
  platform?: 'web' | 'native';
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

const CARD_HEIGHT = 200; // Approximate height of a GameCard
const CARD_MARGIN = 16; // Margin between cards
const LIST_PADDING = 16; // Padding around the list
const PULL_THRESHOLD = 100;

export const GameList: React.FC<GameListProps> = ({
  games,
  isLoading = false,
  onGamePress,
  showOdds = true,
  platform = 'web',
  onRefresh,
  isRefreshing = false,
}) => {
  const windowSize = useWindowSize();
  const listRef = useRef<FixedSizeList>(null);
  const isPresent = useIsPresent();
  const skeletonCount = 3;
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onRefresh) return;
    touchStartY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRefresh || !isPulling) return;
    const touchY = e.touches[0].clientY;
    const scrollTop = (listRef.current as any)?.state?.scrollOffset || 0;
    
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

  // Memoize the row renderer for better performance
  const Row = useCallback(({ index, style }: RowProps) => {
    const game = games[index];
    return (
      <motion.div
        style={{
          ...style,
          height: CARD_HEIGHT,
          padding: `${CARD_MARGIN / 2}px 0`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.2,
          delay: index * 0.05,
        }}
        layout
      >
        <GameCard
          key={game.id}
          game={game}
          onPress={() => onGamePress?.(game)}
          showOdds={showOdds}
          platform={platform}
        />
      </motion.div>
    );
  }, [games, onGamePress, showOdds, platform]);

  // Reset list scroll position when data changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0);
    }
  }, [games]);

  // Calculate list height based on window size
  const listHeight = windowSize.height ? windowSize.height - 100 : 800;
  const listWidth = windowSize.width ? Math.min(windowSize.width - 32, 800) : 800;

  return (
    <div className="flex justify-center w-full">
      <div style={{ width: listWidth }}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="games"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ 
                position: 'relative',
                transform: `translateY(${pullDistance}px)`,
                transition: isPulling ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              {pullDistance > 0 && (
                <motion.div
                  className="absolute left-0 right-0 flex justify-center items-center"
                  style={{ top: -40 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-blue-500 text-sm">
                    {pullDistance >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
                  </div>
                </motion.div>
              )}
              {isRefreshing && (
                <motion.div
                  className="absolute left-0 right-0 flex justify-center items-center"
                  style={{ top: -40 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-blue-500 text-sm">Refreshing...</div>
                </motion.div>
              )}
              <FixedSizeList
                ref={listRef as any}
                height={listHeight}
                itemCount={games.length}
                itemSize={CARD_HEIGHT}
                width={listWidth}
                overscanCount={3}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
              >
                {Row}
              </FixedSizeList>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 