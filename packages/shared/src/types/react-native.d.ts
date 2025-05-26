declare module 'react-native' {
  import { ComponentType } from 'react';

  export interface ViewStyle {
    [key: string]: any;
  }

  export interface TextStyle extends ViewStyle {
    [key: string]: any;
  }

  export interface ImageStyle extends ViewStyle {
    [key: string]: any;
  }

  export interface StyleSheet {
    create<T extends { [key: string]: ViewStyle | TextStyle | ImageStyle }>(styles: T): T;
  }

  export const StyleSheet: {
    create<T extends { [key: string]: ViewStyle | TextStyle | ImageStyle }>(styles: T): T;
  };

  export interface ViewProps {
    style?: ViewStyle | ViewStyle[];
    [key: string]: any;
  }

  export interface TextProps {
    style?: TextStyle | TextStyle[];
    [key: string]: any;
  }

  export interface ImageProps {
    source: { uri: string } | number;
    style?: ImageStyle | ImageStyle[];
    [key: string]: any;
  }

  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    [key: string]: any;
  }

  export interface PressableProps extends ViewProps {
    onPress?: () => void;
    [key: string]: any;
  }

  export interface TextInputProps extends ViewProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    [key: string]: any;
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    contentContainerStyle?: ViewStyle;
    [key: string]: any;
  }

  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Image: ComponentType<ImageProps>;
  export const TouchableOpacity: ComponentType<TouchableOpacityProps>;
  export const Pressable: ComponentType<PressableProps>;
  export const TextInput: ComponentType<TextInputProps>;
  export const ScrollView: ComponentType<ScrollViewProps>;

  export const Dimensions: {
    get(dimension: 'window' | 'screen'): { width: number; height: number };
  };
}

declare module '@shopify/flash-list' {
  import { ViewStyle } from 'react-native';
  import { Component } from 'react';

  export interface ListRenderItemInfo<T> {
    item: T;
    index: number;
  }

  export type ListRenderItem<T> = (info: ListRenderItemInfo<T>) => React.ReactElement | null;

  export interface FlashListProps<T> {
    data: ReadonlyArray<T>;
    renderItem: ListRenderItem<T>;
    estimatedItemSize: number;
    keyExtractor?: (item: T, index: number) => string;
    contentContainerStyle?: ViewStyle;
    onEndReachedThreshold?: number;
    onRefresh?: () => Promise<void>;
    refreshing?: boolean;
  }

  export class FlashList<T> extends Component<FlashListProps<T>> {}
}

declare module 'react-window' {
  import { Component, ComponentType } from 'react';

  export interface FixedSizeListProps {
    children: ComponentType<{
      index: number;
      style: React.CSSProperties;
    }>;
    height: number;
    itemCount: number;
    itemSize: number;
    width: number;
    overscanCount?: number;
    className?: string;
  }

  export class FixedSizeList extends Component<FixedSizeListProps> {
    scrollTo(offset: number): void;
  }
} 