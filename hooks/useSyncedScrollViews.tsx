import { useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';

export type LeaderScrollViewProps = Omit<
  React.ComponentProps<typeof ScrollView>,
  'onScroll' | 'scrollEventThrottle' | 'bounces' | 'horizontal'
>;

export type FollowerScrollViewProps = Omit<
  React.ComponentProps<typeof ScrollView>,
  'bounces' | 'scrollEnabled' | 'bounces' | 'horizontal'
>;

export default function useSyncedScrollViews({
  horizontal = false,
}: {
  horizontal?: boolean;
}) {
  const followerScroll = useRef<ScrollView>(null);
  const axisProp = horizontal ? 'x' : 'y';

  function onLeaderScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    followerScroll.current?.scrollTo({
      [axisProp]: event.nativeEvent.contentOffset[axisProp],
      animated: false,
    });
  }

  return {
    LeaderScrollView: (props: LeaderScrollViewProps) => (
      <ScrollView
        onScroll={onLeaderScroll}
        scrollEventThrottle={16}
        bounces={false}
        horizontal={horizontal}
        {...props}
      />
    ),
    FollowerScrollView: (props: FollowerScrollViewProps) => (
      <ScrollView
        ref={followerScroll}
        scrollEnabled={false}
        bounces={false}
        horizontal={horizontal}
        {...props}
        {...(horizontal
          ? { showsHorizontalScrollIndicator: false }
          : { showsVerticalScrollIndicator: false })}
      />
    ),
  };
}
