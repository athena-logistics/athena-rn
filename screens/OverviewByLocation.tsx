import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllLocationStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import LocationRow from '../components/LocationRow';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';

const OverviewByLocation = ({}: {}) => {
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
  const allLocationDataByLocation = useSelector(
    (state: RootState) => state.global.allLocationDataByLocation
  );
  const [fetch, { loading }] = useAllLocationStockQuery(eventId);
  useMovementSubscription({
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, [eventId]);

  const renderRow = ({ item }: { item: LogisticLocation }) => {
    return <LocationRow row={item} key={item.id} />;
  };

  return (
    <FlatList
      data={allLocationDataByLocation}
      onRefresh={fetch}
      refreshing={loading}
      renderItem={renderRow}
      keyExtractor={(row) => row.id}
    />
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default OverviewByLocation;
