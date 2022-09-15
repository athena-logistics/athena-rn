import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from 'i18n-js';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAllItemsQuery,
  useAllStockQuery,
  useLocationQuery
} from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import MissingItemRow from '../components/MissingItemRow';
import NativeButton from '../components/native/NativeButton';
import NativePicker from '../components/native/NativePicker';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import { getNodes } from '../helpers/apollo';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';
import { setLocations } from '../store/actions/global.actions';

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
  const { data, loading, error } = useLocationQuery(eventId);
  const reduxDispatch = useDispatch();
  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locations = useSelector((state: RootState) => state.global.locations);
  useEffect(() => {
    if (!error && !loading) {
      if (data && data.event?.__typename === 'Event') {
        const locations = [
          {
            name: I18n.t('locations'),
            id: 0,
            children: getNodes(data.event.locations).map((location: any) => ({
              name: location.name,
              id: location.id,
            })),
          },
        ];
        reduxDispatch(setLocations(locations));
      }
    }
  }, [data, error, loading]);

  const [itemFilter, setItemFilter] = useState<string | null>();
  const [locationFilter, setLocationFilter] = useState<string | null>();
  const [fetchAllItems] = useAllItemsQuery(eventId);
  const allItems = useSelector((state: RootState) => state.global.allItems);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const availableItems = getGroupedData(allItems);
  const availableItemsWithUnit = availableItems.map((group) => ({
    ...group,
    children: group.children.map((item) => ({
      ...item,
      name: `${item.name} (${item.unit})`,
    })),
  }));

  useMovementSubscription({
    onSubscriptionData: () => {
      fetchStock();
      fetchAllItems();
    },
  });

  const renderRow = ({ item }: { item: StockItem }) => {
    return <MissingItemRow row={item} onPress={handleRowClick(item)}/>;
  };

  const filteredStock = allStock.filter(
    (stock) =>
      stock.missingCount != 0 &&
      (locationFilter ? stock.locationId == locationFilter : true) &&
      (itemFilter ? stock.id == itemFilter : true)
  );

  const handleSetLocationFilter = (value: any) => {
    setLocationFilter(value);
  };
  const handleSetItemFilter = (value: any) => {
    setItemFilter(value);
  };

  const handleReset = () => {
    setLocationFilter(null);
    setItemFilter(null);
  };

  const navigation = useNavigation();
  const handleMoveAll = () => {
    // @ts-ignore
    navigation.navigate('Supply', {
      items: filteredStock,
      to: locationFilter,
    });
  };

  const handleRowClick = (item: StockItem) => () => {
    // @ts-ignore
    navigation.navigate('Supply', {
      items: [item],
      to: item.locationId,
    });
  };

  return (
    <NativeScreen style={style.screen}>
      <View style={style.top}>
        <NativePicker
          items={locations}
          selectedValue={locationFilter}
          setSelectedValue={handleSetLocationFilter}
          placeholderText={I18n.t('byLocation')}
        />
        <NativeText> </NativeText>
        <NativePicker
          items={availableItemsWithUnit}
          selectedValue={itemFilter}
          setSelectedValue={handleSetItemFilter}
          placeholderText={I18n.t('byItem')}
        />
        <NativeText> </NativeText>
        <MaterialIcons
          name="highlight-remove"
          size={25}
          color={colors.primary}
          onPress={handleReset}
        />
      </View>
      {locationFilter && (
        <View style={style.buttons}>
          <NativeButton title="Supply all" onPress={handleMoveAll}></NativeButton>
        </View>
      )}
      <View>
        <FlatList
          data={filteredStock}
          onRefresh={fetchStock}
          refreshing={loadingStock}
          renderItem={renderRow}
          keyExtractor={(row) => row.id + row.locationId}
          style={style.list}
          contentContainerStyle={style.listContent}
        />
      </View>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {
      // alignItems: 'center',
      // marginVertical: 20,
      flex: 1,
      justifyContent: 'flex-start',
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
    },
    buttons: {
      alignSelf: 'flex-end',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    list: {
      borderColor: colors.primary,
      borderTopWidth: 1,
      borderStyle: 'dotted',
      paddingBottom: 50,
    },
    listContent: {
      paddingBottom: 100,
    },
  });

export default EventMissingItems;
