import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { StockEntryStatus } from '../apollo/schema';
import {
  useAllItemsQuery,
  useAllStockQuery,
} from '../apolloActions/useQueries';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const ItemTypes = ({}: {}) => {
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

  const navigation = useNavigation();
  const handlePress = (item: Item | StockItem) => () => {
    // @ts-ignore
    navigation.navigate('Location Stock By Group', { item });
  };

  const getItemLocationCount = (item: Item | StockItem) =>
    allStock.filter((stock) => stock.id === item.id).length;

  const getItemStatus = (item: Item | StockItem) => {
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

  return (
    <NativeScreen style={style.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loadingItems}
            onRefresh={() => {
              fetchItems();
              fetchStock();
            }}
          />
        }
      >
        <View>
          {groupedItems.map((group) => (
            <View style={style.itemContainer} key={group.id}>
              <View style={style.item}>
                <NativeText type="bold" style={style.itemText}>
                  {group.name}
                  <Entypo name={'cup'} size={44} />
                </NativeText>
              </View>
              {group.children.map((item) => (
                <Pressable onPress={handlePress(item)} key={item.id}>
                  <View style={style.item}>
                    <NativeText style={style.itemText}>{item.name}</NativeText>
                    <NativeText
                      style={{
                        ...style.itemText,
                        ...style[getItemStatus(item)],
                      }}
                    >
                      {getItemLocationCount(item)} locations
                    </NativeText>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
    itemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      margin: 10,
    },
    item: {
      padding: 10,
      width: 120,
      height: 100,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
      margin: 3,
    },
    NORMAL: { color: 'green' },
    IMPORTANT: { color: 'red' },
    WARNING: { color: 'orange' },
    itemText: { fontSize: 16 },
  });

export default ItemTypes;
