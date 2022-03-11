import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllLocationStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import OverviewRow from '../components/OverviewRow';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const OverviewByItem = ({ locationId }: { locationId: string | undefined }) => {
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
  const allLocationDataByStuff = useSelector(
    (state: RootState) => state.global.allLocationDataByStuff
  );
  const [fetch, { loading }] = useAllLocationStockQuery(eventId);
  useMovementSubscription({
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, [eventId, locationId]);

  const renderRow = ({ item }: { item: OverviewRow }) => {
    return <OverviewRow row={item} key={item.id} />;
  };

  return (
    <FlatList
      data={
        locationId
          ? allLocationDataByStuff.filter((s) => s.locationId === locationId)
          : allLocationDataByStuff
      }
      onRefresh={fetch}
      refreshing={loading}
      renderItem={renderRow}
      keyExtractor={(row) => row.id + row.stock}
    />
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default OverviewByItem;
