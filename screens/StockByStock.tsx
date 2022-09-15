import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  useAllItemsQuery,
  useAllStockQuery,
} from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import LocationRow2 from '../components/LocationRow2';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { getGroupedData } from '../helpers/getGroupedData';
import { getLocationData } from '../helpers/getLocationData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';

const StockByStock = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  let eventId: string;

  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
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
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
    fetchAllItems();
  }, [eventId]);

  const renderRow = ({ item }: { item: LogisticLocation }) => {
    return <LocationRow2 row={item} key={item.id} />;
  };

  const handlePress = (location: LogisticLocation) => {
    // @ts-ignore
    // navigation.navigate('Location Stock By Item', { location });
  };

  return (
    <ScrollView horizontal={true} contentContainerStyle={style.container}>
      <View style={style.row}>
        <View style={style.header}>
          <View style={style.headerCell}></View>
        </View>
        {locationData.map((location) => (
          <View style={style.topCell} key={location.id}>
            <NativeText style={style.topCellText}>{location.name}</NativeText>
          </View>
        ))}
      </View>
      <ScrollView>
        {availableItems.map((item) => (
          <>
            <View style={style.row}>
              <View style={style.topGroupCell}>
                <TouchableOpacity
                  key={item.id}
                  // onPress={() => handlePress(item)}
                >
                  <NativeText style={style.topGroupCellText}>
                    {item.name}
                  </NativeText>
                </TouchableOpacity>
              </View>
              {locationData.map(() => (
                <View style={style.groupCell}></View>
              ))}
            </View>
            {item.children.map((child) => (
              <View style={style.row}>
                <View style={style.header}>
                  <View style={style.headerCell}>
                    <NativeText style={style.titleText}>
                      {child.name}
                    </NativeText>
                  </View>
                </View>
                {locationData.map((location) => {
                  const stockAtLocation = location.stockItems.find(
                    (stockItem) => stockItem.id === child.id
                  );
                  console.log(stockAtLocation?.status);
                  const status = stockAtLocation?.status;
                  return (
                    <View
                      // @ts-ignore
                      style={[style.cell, style[status]]}
                      key={child.id + location.id}
                    >
                      <NativeText
                        // @ts-ignore
                        style={[style.cellText, , style[status + 'text']]}
                      >
                        {stockAtLocation?.stock}
                      </NativeText>
                    </View>
                  );
                })}
              </View>
            ))}
          </>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { flexDirection: 'row' },
    container: { flexDirection: 'column' },

    row: {
      flexDirection: 'row',
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
    },
    cell: {
      minWidth: 40,
      minHeight: 40,
      padding: 5,
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
    groupCell: {
      backgroundColor: colors.primaryLight,
      width: 40,
      height: 25,
      padding: 5,
    },
    topGroupCell: {
      width: 80,
      height: 25,
      padding: 5,
      backgroundColor: colors.primaryLight,
    },
    topGroupCellText: {
      fontSize: 12,
      color: colors.white,
    },
    topCell: {
      width: 40,
      height: 60,
      padding: 5,
    },
    topCellText: { fontSize: 12 },
    header: { width: 80, justifyContent: 'center', marginLeft: 5 },
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
