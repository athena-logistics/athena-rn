import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { StockEntryStatus } from '../apollo/schema';
import {
  useAllItemsQuery,
  useAllStockQuery
} from '../apolloActions/useQueries';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
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

  const navigation = useNavigation();
  const handlePress = (item: Item) => () => {
    // @ts-ignore
    navigation.navigate('Item Details', { item });
  };

  const getItemLocationCount = (item: Item) =>
    allStock.filter((stock) => stock.id === item.id).length;

  const getNumberOfItemsPerStatus = (item: Item, status: StockEntryStatus) => {
    return allStock.filter(
      (stock) => stock.id === item.id && stock.status === status
    ).length;
  };

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

  const getGroupNameIcon = (name: string) => {
    switch (name) {
      case 'Becher':
        return (
          <Entypo
            name={'cup'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Bier':
        return (
          <Ionicons
            name={'beer'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Diverses':
        return (
          <Feather
            name={'box'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Softdrinks':
        return (
          <MaterialCommunityIcons
            name={'bottle-soda'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Wein':
        return (
          <MaterialCommunityIcons
            name={'glass-wine'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
    }
  };

  return (
    <NativeScreen style={style.screen}>
      <ScrollView
        contentContainerStyle={style.scrollview}
        style={style.scroll}
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
          {groupedItems.map((group) => (
            <View style={style.itemContainer} key={group.id}>
              <View style={style.headerItem}>
                {getGroupNameIcon(group.name)}
          <NativeText type="bold" style={style.headerText}>
            {group.name}
          </NativeText>
        </View>
        {group.children.map((item) => (
          <Pressable
            onPress={handlePress(item)}
            key={item.id}
                  style={style.item}
                >
                  <NativeText style={style.itemText}>{item.name}</NativeText>
                  <NativeText style={style.itemSubtitleText}>
                    {item.unit}
                  </NativeText>
                  <View style={style.numberContainer}>
                    <MaterialCommunityIcons
                      name="home-city"
                size={18}
                color={colors.primary}
              />
              <NativeText
                style={{
                  ...style.numberText,
                  ...style.IMPORTANT,
                      }}
                      type={'bold'}
                    >
                      {getNumberOfItemsPerStatus(
                        item,
                        StockEntryStatus.Important
                      )}
                    </NativeText>
                    <NativeText
                      style={{
                  ...style.numberText,
                  ...style.WARNING,
                      }}
                      type={'bold'}
                    >
                      {getNumberOfItemsPerStatus(
                        item,
                        StockEntryStatus.Warning
                      )}
                    </NativeText>
                    <NativeText
                      style={{
                  ...style.numberText,
                  ...style.NORMAL,
                }}
                type={'bold'}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Normal)}
              </NativeText>
            </View>
                </Pressable>
              ))}
            </View>
          ))}
      </ScrollView>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch', height: 20, justifyContent: 'center' },
    scroll: { flex: 1, height: '100%' },
    scrollview: { flex: 1, height: '100%' },
    itemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      margin: 10,
    },
    headerItem: {
      paddingVertical: 10,
      paddingHorizontal: 5,
      width: 120,
      height: 100,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
      margin: 3,
      flexDirection: 'row',
    },
    item: {
      paddingVertical: 5,
      paddingHorizontal: 5,
      width: 120,
      height: 100,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
      margin: 3,
      flexDirection: 'column',
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    numberContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      right: 5,
    },
    headerText: { fontSize: 16 },
    itemText: { fontSize: 16 },
    itemSubtitleText: { fontSize: 12, color: colors.grey },
    numberText: { fontSize: 20, marginLeft: 8 },

    NORMAL: { color: colors.green },
    IMPORTANT: { color: colors.red },
    WARNING: { color: colors.orange },
    icon: {
      // color: 'transparent',
      textShadowColor: colors.primary,
      textShadowRadius: 1,
      marginRight: 2,
    },
  });

export default ItemOverview;
