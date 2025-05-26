'use client';

import React, { useState, useEffect } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '../types';
import { ErrorBoundary } from './ErrorBoundary';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
  showOdds?: boolean;
  platform?: 'web' | 'native';
}

const GameCardContent: React.FC<GameCardProps> = ({ 
  game, 
  onPress, 
  showOdds = true,
  platform = 'web'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [prevScore, setPrevScore] = useState({ home: game.score.home, away: game.score.away });
  const [scoreChanged, setScoreChanged] = useState({ home: false, away: false });
  const isLive = game.status === 'live';
  const isScheduled = game.status === 'scheduled';

  useEffect(() => {
    if (game.score.home !== prevScore.home) {
      setScoreChanged(prev => ({ ...prev, home: true }));
      setTimeout(() => setScoreChanged(prev => ({ ...prev, home: false })), 2000);
    }
    if (game.score.away !== prevScore.away) {
      setScoreChanged(prev => ({ ...prev, away: true }));
      setTimeout(() => setScoreChanged(prev => ({ ...prev, away: false })), 2000);
    }
    setPrevScore(game.score);
  }, [game.score.home, game.score.away]);

  const formatTime = (date: Date) => {
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const ampm = utcHours >= 12 ? 'PM' : 'AM';
    const formattedHours = utcHours % 12 || 12;
    const formattedMinutes = utcMinutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const getStatusDisplay = () => {
    switch (game.status) {
      case 'live':
        return game.score.period ? `LIVE - ${game.score.period}` : 'LIVE';
      case 'finished':
        return 'FINAL';
      case 'scheduled':
        return formatTime(new Date(game.startTime));
      default:
        return game.status.toUpperCase();
    }
  };

  // Web-specific styles
  const webStyles = {
    container: `bg-white rounded-lg shadow-md p-4 ${isLive ? 'border-l-4 border-green-500' : ''} hover:shadow-lg transition-all duration-200`,
    header: 'flex justify-between items-center mb-4',
    status: `text-sm font-semibold ${isLive ? 'text-green-500' : 'text-gray-500'}`,
    league: 'text-sm font-medium text-blue-600',
    teams: 'space-y-4',
    team: 'flex items-center space-x-4',
    teamLogo: 'w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center',
    teamLogoText: 'text-sm font-semibold text-gray-600',
    teamInfo: 'flex-1',
    teamName: 'font-medium',
    teamStats: 'text-sm text-gray-500',
    score: 'text-2xl font-bold transition-colors duration-300',
    scoreHighlight: 'text-green-500',
    details: 'mt-4 pt-4 border-t border-gray-100',
    detailsButton: 'text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer',
    odds: 'mt-4 pt-4 border-t border-gray-100',
    oddsText: 'text-sm text-gray-600',
    oddsGrid: 'mt-2 grid grid-cols-3 gap-2',
    oddsItem: 'text-center p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors',
    oddsValue: 'text-lg font-semibold text-gray-900',
    oddsLabel: 'text-xs text-gray-500',
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] // Custom easing for smooth entry
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    },
    hover: {
      y: -2,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const scoreVariants = {
    changed: {
      scale: [1, 1.3, 1],
      color: ["#111827", "#22C55E", "#111827"],
      transition: {
        duration: 0.6,
        times: [0, 0.4, 1],
        ease: "easeInOut"
      }
    }
  };

  const detailsVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const detailsItemVariants = {
    closed: { 
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const renderTeam = (team: Game['homeTeam'] | Game['awayTeam'], score: number, isHome: boolean) => (
    <motion.div 
      className={webStyles.team}
      initial={{ opacity: 0, x: isHome ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: isHome ? 0 : 0.1 }}
    >
      {team.logo ? (
        <motion.img 
          src={team.logo} 
          alt={team.name} 
          className={webStyles.teamLogo}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.div 
          className={webStyles.teamLogo}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <span className={webStyles.teamLogoText}>{team.abbreviation}</span>
        </motion.div>
      )}
      <div className={webStyles.teamInfo}>
        <div className={webStyles.teamName}>{team.name}</div>
        {team.stats && (
          <motion.div 
            className={webStyles.teamStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {team.stats.wins}W - {team.stats.losses}L
            {team.stats.ties !== undefined && ` - ${team.stats.ties}T`}
            {team.stats.rank && ` • Rank ${team.stats.rank}`}
          </motion.div>
        )}
      </div>
      <motion.span 
        className={`${webStyles.score} ${
          (isHome ? scoreChanged.home : scoreChanged.away) ? webStyles.scoreHighlight : ''
        }`}
        animate={
          (isHome ? scoreChanged.home : scoreChanged.away)
            ? { scale: [1, 1.2, 1], color: ['#111827', '#22C55E', '#111827'] }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        {score}
      </motion.span>
    </motion.div>
  );

  return (
    <motion.div 
      className={webStyles.container}
      onClick={onPress}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      layout
    >
      <motion.div className={webStyles.header} layout>
        <div className="flex items-center space-x-2">
          <motion.span 
            className={webStyles.status}
            animate={{ opacity: isLive ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 2, repeat: isLive ? Infinity : 0 }}
          >
            {getStatusDisplay()}
          </motion.span>
          <span className={webStyles.league}>{game.league}</span>
        </div>
        {game.venue && <span className="text-sm text-gray-500">{game.venue}</span>}
      </motion.div>

      <motion.div className={webStyles.teams} layout>
        {renderTeam(game.homeTeam, game.score.home, true)}
        {renderTeam(game.awayTeam, game.score.away, false)}
      </motion.div>

      <AnimatePresence mode="wait">
        {showDetails && (
          <motion.div 
            className={webStyles.details}
            variants={detailsVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {isLive && game.score.display && (
              <motion.div 
                className="mb-4"
                variants={detailsItemVariants}
              >
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Live Updates</h4>
                <p className="text-sm text-gray-600">{game.score.display}</p>
              </motion.div>
            )}
            {game.venue && (
              <motion.div 
                className="mb-4"
                variants={detailsItemVariants}
              >
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Venue</h4>
                <p className="text-sm text-gray-600">{game.venue}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="mt-4 flex justify-between items-center" layout>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className={webStyles.detailsButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </motion.button>
        
        {showOdds && game.odds && (
          <motion.div 
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className={webStyles.oddsGrid}>
              <motion.div 
                className={webStyles.oddsItem}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={webStyles.oddsValue}>{game.odds.homeWin}</div>
                <div className={webStyles.oddsLabel}>{game.homeTeam.abbreviation} Win</div>
              </motion.div>
              {game.odds.draw !== undefined && (
                <motion.div 
                  className={webStyles.oddsItem}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={webStyles.oddsValue}>{game.odds.draw}</div>
                  <div className={webStyles.oddsLabel}>Draw</div>
                </motion.div>
              )}
              <motion.div 
                className={webStyles.oddsItem}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={webStyles.oddsValue}>{game.odds.awayWin}</div>
                <div className={webStyles.oddsLabel}>{game.awayTeam.abbreviation} Win</div>
              </motion.div>
            </div>
            {game.odds.spread && (
              <motion.div 
                className="mt-2 text-sm text-gray-500"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Spread: {game.odds.spread.favorite} {game.odds.spread.points} ({game.odds.spread.odds})
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const GameCard: React.FC<GameCardProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <motion.div 
          className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-red-600">Unable to display game information</p>
        </motion.div>
      }
    >
      <GameCardContent {...props} />
    </ErrorBoundary>
  );
}; 