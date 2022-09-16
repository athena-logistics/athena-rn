import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';

const StockByLocation = ({}: {}) => {
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

  const handlePress = (location: LogisticLocation) => {
    // @ts-ignore
    // navigation.navigate('Location Stock By Item', { location });
  };

  return (
    <ScrollView horizontal={true}>
      <View style={style.container}>
        <View style={style.row}>
          <View style={style.header}>
            <View style={style.headerCell}></View>
          </View>
          {availableItems.map((item) => (
            <>
              <View style={style.topGroupCell} key={item.id}>
                <NativeText style={style.topGroupCellText}>
                  {item.name}
                </NativeText>
              </View>
              {item.children.map((child) => (
                <View style={style.topCell} key={child.id}>
                  <NativeText style={style.topCellText}>
                    {child.name}
                  </NativeText>
                </View>
              ))}
            </>
          ))}
        </View>
        {locationData.map((location) => (
          <View style={style.row}>
            <View style={style.header}>
              <TouchableOpacity
                key={location.id}
                style={style.headerCell}
                onPress={() => handlePress(location)}
              >
                <NativeText style={style.titleText}>{location.name}</NativeText>
              </TouchableOpacity>
            </View>
            {availableItems.map((item) => (
              <>
                <View style={style.groupCell} key={item.id}></View>
                {item.children.map((child) => {
                  const stockAtLocation = location.stockItems.find(
                    (stockItem) => stockItem.id === child.id
                  );
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
              </>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { flexDirection: 'row' },
    container: { alignItems: 'stretch', flex: 1 },

    row: {
      flexDirection: 'row',
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
    },
    cell: {
      width: 40,
      height: 40,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellText: {
      fontSize: 16,
      fontFamily: fonts.defaultFontFamilyBold,
    },
    headerCell: {
      // paddingHorizontal: 20,
      // paddingVertical: 10,
    },
    groupCell: {},
    topGroupCell: { width: 20, height: 100, padding: 5 },
    topGroupCellText: {
      fontSize: 12,
    },
    topCell: {
      width: 40,
      height: 100,
      padding: 5,
    },
    topCellText: { fontSize: 12 },
    header: { width: 100, justifyContent: 'center', marginLeft: 20 },
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

export default StockByLocation;
