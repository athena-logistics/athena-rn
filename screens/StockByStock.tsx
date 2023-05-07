import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { Fragment } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ItemFragment,
  LocationFragment,
  LogisticEventConfigurationFragment,
  StockFragment,
} from '../apollo/schema';
import { LogisticsParamsList } from '../components/LogisticNavigation';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { getNodes } from '../helpers/apollo';

export default function StockByStock({
  event,
  refetch,
  stateReloading,
}: {
  event: LogisticEventConfigurationFragment;
  refetch: () => void;
  stateReloading: boolean;
}) {
  const { width } = useWindowDimensions();

  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();

  const locations = getNodes(event.locations);
  const itemGroups = getNodes(event.itemGroups);
  const items = getNodes(event.items);
  const stock = getNodes(event.stock);

  const columnWidth = Math.max(width / (locations.length + 1), 50);

  const style = styles(columnWidth);

  const handleLocationPress = (location: LocationFragment) => () => {
    navigation.navigate('stack', {
      screen: 'location',
      params: { location },
    });
  };

  const handleItemPress = (item: ItemFragment) => () => {
    navigation.navigate('stack', {
      screen: 'item',
      params: { item },
    });
  };

  const handleStockItemPress = (stock: StockFragment) => () => {
    navigation.navigate('stack', {
      screen: 'stock-item',
      params: { stock },
    });
  };

  return (
    <ScrollView horizontal={true}>
      <View style={style.container}>
        <View style={style.row}>
          <View style={style.header}>
            <TouchableOpacity style={style.cornerCell} onPress={refetch}>
              <Ionicons
                size={19}
                name={'ios-refresh-circle-outline'}
                color={colors.primary}
              />

              <NativeText style={{ fontSize: 10 }}>
                {stateReloading ? (
                  <FormattedMessage
                    id="refreshing"
                    defaultMessage="Refreshing..."
                  />
                ) : (
                  <FormattedMessage id="refresh" defaultMessage="Refresh" />
                )}
              </NativeText>
            </TouchableOpacity>
          </View>
          {locations.map((location) => (
            <TouchableOpacity
              style={style.topCell}
              key={location.id}
              onPress={handleLocationPress(location)}
            >
              <NativeText style={style.topCellText}>{location.name}</NativeText>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          {itemGroups.map((itemGroup) => (
            <Fragment key={itemGroup.id}>
              <View style={style.row}>
                <View style={style.topGroupCell}>
                  <View key={itemGroup.id}>
                    <NativeText style={style.topGroupCellText}>
                      {itemGroup.name}
                    </NativeText>
                  </View>
                </View>
                {locations.map((d, index) => (
                  <View style={style.groupCell} key={index}></View>
                ))}
              </View>
              {items
                .filter((item) => item.itemGroup.id === itemGroup.id)
                .map((item) => (
                  <View style={style.row} key={item.id}>
                    <View style={style.header}>
                      <TouchableOpacity onPress={handleItemPress(item)}>
                        <NativeText style={style.titleText}>
                          {item.name}
                        </NativeText>
                      </TouchableOpacity>
                    </View>
                    {locations.map((location) => {
                      const stockAtLocation = stock.find(
                        (stock) =>
                          stock.item.id === item.id &&
                          stock.location.id === location.id
                      );

                      if (!stockAtLocation) {
                        return (
                          <View style={style.cell} key={item.id + location.id}>
                            <NativeText style={[style.cellText]}>0</NativeText>
                          </View>
                        );
                      }

                      return (
                        <TouchableOpacity
                          style={[style.cell, style[stockAtLocation.status]]}
                          key={item.id + location.id}
                          onPress={handleStockItemPress(stockAtLocation)}
                        >
                          <NativeText
                            style={[
                              style.cellText,
                              style[`${stockAtLocation.status}text`],
                            ]}
                          >
                            <FormattedNumber value={stockAtLocation?.stock} />
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
}

const styles = (columnWidth: number) =>
  StyleSheet.create({
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
      width: columnWidth,
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
    cornerCell: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupCell: {
      backgroundColor: colors.primaryLight,
      width: columnWidth,
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
      width: columnWidth,
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
