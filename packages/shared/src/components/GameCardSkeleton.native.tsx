import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

export const GameCardSkeleton: React.FC = () => {
  const shimmerValue = useSharedValue(-100);

  React.useEffect(() => {
    shimmerValue.value = withRepeat(
      withSequence(
        withTiming(-100, { duration: 0 }),
        withTiming(100, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, []);

  const createShimmerStyle = (delay: number = 0) =>
    useAnimatedStyle(() => ({
      transform: [{ translateX: withDelay(delay, shimmerValue.value) }],
    }));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    teamContainer: {
      marginVertical: 8,
    },
    teamRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    footer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    shimmerBase: {
      overflow: 'hidden',
      backgroundColor: '#F3F4F6',
    },
    shimmerOverlay: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      opacity: 0.3,
    },
    statusShimmer: {
      width: 80,
      height: 16,
      borderRadius: 4,
    },
    leagueShimmer: {
      width: 120,
      height: 16,
      borderRadius: 4,
    },
    teamLogo: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    teamName: {
      width: 120,
      height: 16,
      borderRadius: 4,
      marginLeft: 12,
    },
    score: {
      width: 24,
      height: 24,
      borderRadius: 4,
      marginLeft: 'auto',
    },
    oddsContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    oddsItem: {
      width: 60,
      height: 40,
      borderRadius: 4,
    },
  });

  const renderShimmerBlock = (style: any, delay: number = 0) => (
    <Animated.View style={[styles.shimmerBase, style]}>
      <Animated.View style={[styles.shimmerOverlay, createShimmerStyle(delay)]} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderShimmerBlock(styles.statusShimmer)}
        {renderShimmerBlock(styles.leagueShimmer, 100)}
      </View>

      <View style={styles.teamContainer}>
        {[0, 1].map((index) => (
          <Animated.View
            key={index}
            style={styles.teamRow}
            entering={FadeIn.delay(index * 100)}
          >
            {renderShimmerBlock(styles.teamLogo, index * 150)}
            {renderShimmerBlock(styles.teamName, index * 150 + 50)}
            {renderShimmerBlock(styles.score, index * 150 + 100)}
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        {renderShimmerBlock(styles.statusShimmer, 400)}
        <View style={styles.oddsContainer}>
          {[0, 1, 2].map((index) => (
            renderShimmerBlock(styles.oddsItem, 450 + index * 50)
          ))}
        </View>
      </View>
    </View>
  );
}; 