import { Ionicons } from '@expo/vector-icons';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { Fragment, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  useAllItemsQuery,
  useAllStockQuery,
} from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { getGroupedData } from '../helpers/getGroupedData';
import { getLocationData } from '../helpers/getLocationData';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';
import { RootParamsList } from '../components/Navigation';
import { Item } from '../models/Item';
import { StockItem } from '../models/StockItem';

const StockByStock = () => {
  let eventId: string;

  const route = useRoute<RouteProp<RootParamsList, 'Overview all'>>();
  const navigation = useNavigation<NavigationProp<RootParamsList>>();
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetch, { loading }] = useAllStockQuery(eventId);
  const [fetchAllItems] = useAllItemsQuery(eventId);

  const allItems = useSelector((state: RootState) => state.global.allItems);
  const availableItems = getGroupedData(allItems);

  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locationData = getLocationData(allStock);

  useMovementSubscription({
    onData: () => fetch(),
  });

  useEffect(() => {
    fetch();
    fetchAllItems();
  }, [eventId]);

  const handleLocationPress = (location: LogisticLocation) => () => {
    // navigation.navigate('Location Stock By Item', { location });
    navigation.navigate('Overview Stack', {
      screen: 'Location Details',
      params: { location },
    });
  };

  const handleItemPress = (item: Item) => () => {
    // navigation.navigate('Location Stock By Item', { location });
    navigation.navigate('Overview Stack', {
      screen: 'Item Details',
      params: { item },
    });
  };

  const handleStockItemPress = (row?: StockItem) => () => {
    if (row) {
      navigation.navigate('Overview Stack', {
        screen: 'Stock Item Details',
        params: { stockItem: row },
      });
    }
  };

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.cornerCell}
              onPress={() => {
                if (!loading) {
                  fetch();
                  fetchAllItems();
                }
              }}
            >
              {loading ? (
                <ActivityIndicator size={'small'} color={colors.primary} />
              ) : (
                <Ionicons
                  size={19}
                  name={'ios-refresh-circle-outline'}
                  color={colors.primary}
                />
              )}
              <NativeText style={{ fontSize: 10 }}>
                {loading ? 'Refreshing' : 'Refresh'}
              </NativeText>
            </TouchableOpacity>
          </View>
          {locationData.map((location) => (
            <TouchableOpacity
              style={styles.topCell}
              key={location.id}
              onPress={handleLocationPress(location)}
            >
              <NativeText style={styles.topCellText}>
                {location.name}
              </NativeText>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          {availableItems.map((item) => (
            <Fragment key={item.id}>
              <View style={styles.row}>
                <View style={styles.topGroupCell}>
                  <View key={item.id}>
                    <NativeText style={styles.topGroupCellText}>
                      {item.name}
                    </NativeText>
                  </View>
                </View>
                {locationData.map((d, index) => (
                  <View style={styles.groupCell} key={index}></View>
                ))}
              </View>
              {item.children.map((child) => (
                <View style={styles.row} key={child.id}>
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={styles.headerCell}
                      onPress={handleItemPress(child)}
                    >
                      <NativeText style={styles.titleText}>
                        {child.name}
                      </NativeText>
                    </TouchableOpacity>
                  </View>
                  {locationData.map((location) => {
                    const stockAtLocation = location.stockItems.find(
                      (stockItem) => stockItem.id === child.id
                    );
                    const status = stockAtLocation?.status;
                    return (
                      <TouchableOpacity
                        style={[styles.cell, status ? styles[status] : null]}
                        key={child.id + location.id}
                        onPress={handleStockItemPress(stockAtLocation)}
                      >
                        <NativeText
                          style={[
                            styles.cellText,
                            status ? styles[`${status}text`] : null,
                          ]}
                        >
                          {stockAtLocation?.stock}
                        </NativeText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </Fragment>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flexDirection: 'row' },
  container: {
    flexDirection: 'column',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    borderColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  cell: {
    minWidth: 50,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  cellText: {
    fontSize: 16,
    fontFamily: fonts.defaultFontFamilyBold,
  },
  headerCell: {
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  cornerCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCell: {
    backgroundColor: colors.primaryLight,
    minWidth: 50,
    minHeight: 25,
  },
  topGroupCell: {
    minWidth: 80,
    minHeight: 25,
    padding: 5,
    backgroundColor: colors.primaryLight,
  },
  topGroupCellText: {
    fontSize: 12,
    color: colors.white,
  },
  topCell: {
    width: 50,
    minHeight: 60,
    padding: 5,
    borderColor: colors.primary,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  topCellText: { fontSize: 12 },
  header: { width: 80, justifyContent: 'center' },
  list: {
    alignSelf: 'flex-start',
  },
  titleText: {
    fontSize: 12,
    fontFamily: fonts.defaultFontFamilyBold,
  },
  NORMAL: { backgroundColor: colors.green },
  IMPORTANT: { backgroundColor: colors.red },
  WARNING: { backgroundColor: colors.orange },
  NORMALtext: { color: colors.black },
  IMPORTANTtext: { color: colors.black },
  WARNINGtext: { color: colors.black },
});

export default StockByStock;
