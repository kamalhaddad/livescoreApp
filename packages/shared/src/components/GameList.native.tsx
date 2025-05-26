import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { ListRenderItem } from '@shopify/flash-list';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { GameCard } from './GameCard';
import { GameCardSkeleton } from './GameCardSkeleton';
import { Game } from '../types';

interface GameListProps {
  games: Game[];
  isLoading?: boolean;
  onGamePress?: (game: Game) => void;
  showOdds?: boolean;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const ESTIMATED_ITEM_SIZE = 200;

export const GameList: React.FC<GameListProps> = ({
  games,
  isLoading = false,
  onGamePress,
  showOdds = true,
  onRefresh,
  isRefreshing = false,
}) => {
  const skeletonCount = 3;
  const windowHeight = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      backgroundColor: 'transparent',
      paddingBottom: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      minHeight: '100%',
    },
    listContainer: {
      height: windowHeight - 100,
    },
    itemContainer: {
      marginBottom: 12,
    },
  });

  const renderItem: ListRenderItem<Game> = useCallback(({ item, index }) => (
    <Animated.View
      entering={FadeIn.delay(index * 50)}
      layout={Layout.springify()}
      style={styles.itemContainer}
    >
      <GameCard
        game={item}
        onPress={() => onGamePress?.(item)}
        showOdds={showOdds}
      />
    </Animated.View>
  ), [onGamePress, showOdds]);

  const keyExtractor = useCallback((item: Game) => item.id, []);

  if (isLoading) {
    return (
      <AnimatedView 
        entering={FadeIn} 
        exiting={FadeOut}
        style={[styles.container, styles.content]}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Animated.View
            key={`skeleton-${index}`}
            style={styles.itemContainer}
            entering={FadeIn.delay(index * 100)}
            layout={Layout.springify()}
          >
            <GameCardSkeleton />
          </Animated.View>
        ))}
      </AnimatedView>
    );
  }

  return (
    <View style={[styles.container, styles.listContainer]}>
      <FlashList
        data={games}
        renderItem={renderItem}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}; 