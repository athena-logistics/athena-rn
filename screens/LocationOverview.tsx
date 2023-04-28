import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import OverviewLocationRow from '../components/LocationRow';
import NativeScreen from '../components/native/NativeScreen';
import { getLocationData } from '../helpers/getLocationData';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';
import { OverviewTabsParamsList } from '../components/Navigation';

const LocationOverview: React.FC = () => {
  const route = useRoute<RouteProp<OverviewTabsParamsList, 'By Location'>>();

  const eventId =
    route.params?.eventId ??
    useSelector((state: RootState) => state.global.eventId);

  const [fetch, { loading }] = useAllStockQuery(eventId);

  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locationData = getLocationData(allStock);

  useMovementSubscription({
    onData: () => fetch(),
  });

  useEffect(() => {
    fetch();
  }, [eventId]);

  const renderRow = ({ item }: { item: LogisticLocation }) => {
    return <OverviewLocationRow row={item} key={item.id} />;
  };

  return (
    <NativeScreen style={styles.screen}>
      <FlatList
        data={locationData}
        onRefresh={fetch}
        refreshing={loading}
        renderItem={renderRow}
        keyExtractor={(row) => row.id}
      />
    </NativeScreen>
  );
};

const styles = StyleSheet.create({
  screen: { alignItems: 'stretch' },
});

export default LocationOverview;
