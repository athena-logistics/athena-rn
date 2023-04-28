import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  useAllItemsQuery,
  useAllStockQuery,
} from '../apolloActions/useQueries';
import NativeScreen from '../components/native/NativeScreen';
import OverviewItemRow from '../components/OverviewItemRow';
import { getGroupedData } from '../helpers/getGroupedData';
import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { RootState } from '../store';
import { OverviewTabsParamsList } from '../components/Navigation';
import { Item } from '../models/Item';

const ItemOverview: React.FC = () => {
  const route = useRoute<RouteProp<OverviewTabsParamsList, 'By Item'>>();

  const eventId =
    route.params?.eventId ??
    useSelector((state: RootState) => state.global.eventId);

  const [fetchItems, { loading: loadingItems }] = useAllItemsQuery(eventId);
  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);

  useEffect(() => {
    fetchItems();
    fetchStock();
  }, [eventId]);

  const allItems = useSelector((state: RootState) => state.global.allItems);

  const groupedItems = getGroupedData(allItems);

  const renderGroup = ({ item }: { item: AvailableItemGroup<Item> }) => {
    return <OverviewItemRow group={item} key={item.id} />;
  };

  return (
    <NativeScreen style={styles.screen}>
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

const styles = StyleSheet.create({
  screen: {
    // alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
});

export default ItemOverview;
