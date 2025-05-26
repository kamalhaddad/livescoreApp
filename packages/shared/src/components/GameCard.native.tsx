import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ViewStyle, TextStyle, TouchableOpacity, Image, ImageStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  interpolateColor,
  Layout,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Game } from '../types';
import { ErrorBoundary } from './ErrorBoundary';

interface GameCardProps {
  game: Game;
  onPress?: () => void;
  showOdds?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const GameCardContent: React.FC<GameCardProps> = ({ 
  game, 
  onPress, 
  showOdds = true
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [prevScore, setPrevScore] = useState({ home: game.score.home, away: game.score.away });
  const isLive = game.status === 'live';

  const cardScale = useSharedValue(1);
  const statusOpacity = useSharedValue(1);
  const homeScoreScale = useSharedValue(1);
  const awayScoreScale = useSharedValue(1);

  // Enhanced spring configuration for smoother animations
  const springConfig = {
    damping: 15,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2
  };

  useEffect(() => {
    if (isLive) {
      statusOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      statusOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [isLive]);

  useEffect(() => {
    if (game.score.home !== prevScore.home) {
      homeScoreScale.value = withSequence(
        withSpring(1.3, springConfig),
        withSpring(1, springConfig)
      );
    }
    if (game.score.away !== prevScore.away) {
      awayScoreScale.value = withSequence(
        withSpring(1.3, springConfig),
        withSpring(1, springConfig)
      );
    }
    setPrevScore(game.score);
  }, [game.score.home, game.score.away]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(cardScale.value, springConfig) },
      { translateY: withSpring(cardScale.value === 0.98 ? 2 : 0, springConfig) }
    ],
  }));

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statusOpacity.value,
    transform: [{ scale: interpolate(statusOpacity.value, [0.5, 1], [0.98, 1]) }]
  }));

  const homeScoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: homeScoreScale.value }],
    opacity: interpolate(homeScoreScale.value, [1, 1.3], [1, 0.8])
  }));

  const awayScoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: awayScoreScale.value }],
    opacity: interpolate(awayScoreScale.value, [1, 1.3], [1, 0.8])
  }));

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

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      ...(isLive && { borderLeftWidth: 4, borderLeftColor: '#22C55E' }),
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    } as ViewStyle,
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    } as ViewStyle,
    status: {
      fontSize: 12,
      fontWeight: '600',
      color: isLive ? '#22C55E' : '#6B7280',
      marginRight: 8,
    } as TextStyle,
    league: {
      fontSize: 12,
      fontWeight: '500',
      color: '#2563EB',
    } as TextStyle,
    venue: {
      fontSize: 12,
      color: '#6B7280',
    } as TextStyle,
    teams: {
      marginVertical: 8,
    } as ViewStyle,
    team: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    } as ViewStyle,
    teamLogo: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    } as ImageStyle,
    teamLogoText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
    } as TextStyle,
    teamInfo: {
      flex: 1,
    } as ViewStyle,
    teamName: {
      fontSize: 16,
      fontWeight: '500',
    } as TextStyle,
    teamStats: {
      fontSize: 12,
      color: '#6B7280',
    } as TextStyle,
    score: {
      fontSize: 24,
      fontWeight: '700',
    } as TextStyle,
    details: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
    } as ViewStyle,
    detailsSection: {
      marginBottom: 16,
    } as ViewStyle,
    detailsTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
    } as TextStyle,
    detailsText: {
      fontSize: 12,
      color: '#6B7280',
    } as TextStyle,
    actions: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    detailsButton: {
      padding: 8,
    } as ViewStyle,
    detailsButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#2563EB',
    } as TextStyle,
    oddsContainer: {
      alignItems: 'flex-end',
    } as ViewStyle,
    oddsGrid: {
      flexDirection: 'row',
      gap: 8,
    } as ViewStyle,
    oddsItem: {
      backgroundColor: '#F9FAFB',
      padding: 8,
      borderRadius: 4,
      alignItems: 'center',
      minWidth: 80,
    } as ViewStyle,
    oddsValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
    } as TextStyle,
    oddsLabel: {
      fontSize: 10,
      color: '#6B7280',
    } as TextStyle,
    spreadText: {
      marginTop: 8,
      fontSize: 12,
      color: '#6B7280',
    } as TextStyle,
  };

  const renderTeam = (team: Game['homeTeam'] | Game['awayTeam'], score: number, isHome: boolean) => (
    <Animated.View 
      style={[styles.team]}
      entering={isHome ? SlideInLeft : SlideInRight}
      layout={Layout.springify().damping(15).mass(0.8)}
    >
      {team.logo ? (
        <Image source={{ uri: team.logo }} style={styles.teamLogo} />
      ) : (
        <View style={styles.teamLogo}>
          <Text style={styles.teamLogoText}>{team.abbreviation}</Text>
        </View>
      )}
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        {team.stats && (
          <Animated.Text 
            style={styles.teamStats}
            entering={FadeIn.delay(200)}
          >
            {team.stats.wins}W - {team.stats.losses}L
            {team.stats.ties !== undefined && ` - ${team.stats.ties}T`}
            {team.stats.rank && ` • Rank ${team.stats.rank}`}
          </Animated.Text>
        )}
      </View>
      <Animated.Text 
        style={[
          styles.score,
          isHome ? homeScoreAnimatedStyle : awayScoreAnimatedStyle
        ]}
      >
        {score}
      </Animated.Text>
    </Animated.View>
  );

  return (
    <AnimatedPressable 
      style={[styles.container, cardAnimatedStyle]}
      onPressIn={() => {
        cardScale.value = withSpring(0.98, springConfig);
      }}
      onPressOut={() => {
        cardScale.value = withSpring(1, springConfig);
      }}
      onPress={onPress}
    >
      <Animated.View 
        style={styles.header} 
        layout={Layout.springify().damping(15).mass(0.8)}
      >
        <View style={styles.headerLeft}>
          <Animated.Text style={[styles.status, statusAnimatedStyle]}>
            {getStatusDisplay()}
          </Animated.Text>
          <Text style={styles.league}>{game.league}</Text>
        </View>
        {game.venue && <Text style={styles.venue}>{game.venue}</Text>}
      </Animated.View>

      <Animated.View 
        style={styles.teams} 
        layout={Layout.springify().damping(15).mass(0.8)}
      >
        {renderTeam(game.homeTeam, game.score.home, true)}
        {renderTeam(game.awayTeam, game.score.away, false)}
      </Animated.View>

      {showDetails && (
        <Animated.View 
          style={styles.details}
          entering={FadeIn.duration(400).springify()}
          exiting={FadeOut.duration(300).springify()}
          layout={Layout.springify().damping(15).mass(0.8)}
        >
          {isLive && game.score.display && (
            <Animated.View 
              style={styles.detailsSection}
              entering={FadeIn.delay(100).springify()}
            >
              <Text style={styles.detailsTitle}>Live Updates</Text>
              <Text style={styles.detailsText}>{game.score.display}</Text>
            </Animated.View>
          )}
          {game.venue && (
            <Animated.View 
              style={styles.detailsSection}
              entering={FadeIn.delay(200).springify()}
            >
              <Text style={styles.detailsTitle}>Venue</Text>
              <Text style={styles.detailsText}>{game.venue}</Text>
            </Animated.View>
          )}
        </Animated.View>
      )}

      <Animated.View 
        style={styles.actions} 
        layout={Layout.springify().damping(15).mass(0.8)}
      >
        <AnimatedTouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          style={styles.detailsButton}
          onPressIn={() => {
            cardScale.value = withSpring(0.95, springConfig);
          }}
          onPressOut={() => {
            cardScale.value = withSpring(1, springConfig);
          }}
        >
          <Text style={styles.detailsButtonText}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Text>
        </AnimatedTouchableOpacity>

        {showOdds && game.odds && (
          <Animated.View 
            style={styles.oddsContainer}
            entering={FadeIn.delay(300).duration(400).springify()}
          >
            <View style={styles.oddsGrid}>
              <AnimatedTouchableOpacity 
                style={styles.oddsItem}
                onPressIn={() => {
                  cardScale.value = withSpring(0.95, springConfig);
                }}
                onPressOut={() => {
                  cardScale.value = withSpring(1, springConfig);
                }}
              >
                <Text style={styles.oddsValue}>{game.odds.homeWin}</Text>
                <Text style={styles.oddsLabel}>{game.homeTeam.abbreviation} Win</Text>
              </AnimatedTouchableOpacity>
              {game.odds.draw !== undefined && (
                <AnimatedTouchableOpacity 
                  style={styles.oddsItem}
                  onPressIn={() => {
                    cardScale.value = withSpring(0.95, springConfig);
                  }}
                  onPressOut={() => {
                    cardScale.value = withSpring(1, springConfig);
                  }}
                >
                  <Text style={styles.oddsValue}>{game.odds.draw}</Text>
                  <Text style={styles.oddsLabel}>Draw</Text>
                </AnimatedTouchableOpacity>
              )}
              <AnimatedTouchableOpacity 
                style={styles.oddsItem}
                onPressIn={() => {
                  cardScale.value = withSpring(0.95, springConfig);
                }}
                onPressOut={() => {
                  cardScale.value = withSpring(1, springConfig);
                }}
              >
                <Text style={styles.oddsValue}>{game.odds.awayWin}</Text>
                <Text style={styles.oddsLabel}>{game.awayTeam.abbreviation} Win</Text>
              </AnimatedTouchableOpacity>
            </View>
            {game.odds.spread && (
              <Animated.Text 
                style={styles.spreadText}
                entering={FadeIn.delay(400).springify()}
              >
                Spread: {game.odds.spread.favorite} {game.odds.spread.points} ({game.odds.spread.odds})
              </Animated.Text>
            )}
          </Animated.View>
        )}
      </Animated.View>
    </AnimatedPressable>
  );
};

export const GameCard: React.FC<GameCardProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <Animated.View 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#DC2626',
          }}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={{ color: '#DC2626' }}>Unable to display game information</Text>
        </Animated.View>
      }
    >
      <GameCardContent {...props} />
    </ErrorBoundary>
  );
}; 