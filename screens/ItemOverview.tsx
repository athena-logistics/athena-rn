import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { StockEntryStatus } from '../apollo/schema';
import {
  useAllItemsQuery,
  useAllStockQuery,
} from '../apolloActions/useQueries';
import NativeScreen from '../components/native/NativeScreen';
import OverviewItemRow from '../components/OverviewItemRow';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { RootState } from '../store';

const ItemOverview: React.FC = () => {
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

  const [fetchItems, { loading: loadingItems }] = useAllItemsQuery(eventId);
  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);

  useEffect(() => {
    fetchItems();
    fetchStock();
  }, [eventId]);

  const allItems = useSelector((state: RootState) => state.global.allItems);
  const allStock = useSelector((state: RootState) => state.global.allStock);

  const groupedItems = getGroupedData(allItems);

  const getItemLocationCount = (item: Item) =>
    allStock.filter((stock) => stock.id === item.id).length;

  const getItemStatus = (item: Item) => {
    const allLocationStock = allStock.filter((stock) => stock.id === item.id);
    if (
      allLocationStock.some(
        (stock) => stock.status === StockEntryStatus.Important
      )
    ) {
      return StockEntryStatus.Important;
    }

    if (
      allLocationStock.some(
        (stock) => stock.status === StockEntryStatus.Warning
      )
    ) {
      return StockEntryStatus.Warning;
    }
    return StockEntryStatus.Normal;
  };

  const renderGroup = ({ item }: { item: AvailableItemGroup }) => {
    return <OverviewItemRow group={item} key={item.id} />;
  };

  return (
    <NativeScreen style={style.screen}>
      <FlatList
        data={groupedItems}
        onRefresh={() => {
          fetchItems();
          fetchStock();
        }}
        refreshing={loadingItems || loadingStock}
        renderItem={renderGroup}
        keyExtractor={(row) => row.id}
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

export default ItemOverview;
