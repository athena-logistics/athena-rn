import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllLocationStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeScreen from '../components/native/NativeScreen';
import OverviewRow from '../components/OverviewRow';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const Overview = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  let eventId: string;

  const route = useRoute();
  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }
  const allLocationData = useSelector(
    (state: RootState) => state.global.allLocationData
  );
  const [fetch, { loading }] = useAllLocationStockQuery(eventId);
  useMovementSubscription({ onSubscriptionData: () => fetch() });

  useEffect(() => {
    fetch();
  }, [eventId]);

  const renderRow = ({ item }: { item: OverviewRow }) => {
    return <OverviewRow row={item} key={item.id} />;
  };

  return (
    <NativeScreen style={style.screen}>
      <FlatList
        data={allLocationData}
        onRefresh={fetch}
        refreshing={loading}
        renderItem={renderRow}
        keyExtractor={(row) => row.id + row.stock}
      />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default Overview;
