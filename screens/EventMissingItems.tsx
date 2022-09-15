import { useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import MissingItemRow from '../components/MissingItemRow';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const EventMissingItems: React.FC = () => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });
  const route = useRoute();

  let eventId: string;

  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);

  useMovementSubscription({
    onSubscriptionData: () => {
      fetchStock();
    },
  });

  const allStock = useSelector((state: RootState) => state.global.allStock);

  const renderRow = ({ item }: { item: StockItem }) => {
    return <MissingItemRow row={item} />;
  };

  return (
    <NativeScreen style={style.screen}>
      <FlatList
        data={allStock.filter((stock) => stock.missingCount != 0)}
        onRefresh={fetchStock}
        refreshing={loadingStock}
        renderItem={renderRow}
        keyExtractor={(row) => row.id + row.locationId}
      />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {
      // alignItems: 'center',
      flex: 1,
      marginVertical: 10,
    },
  });

export default EventMissingItems;
