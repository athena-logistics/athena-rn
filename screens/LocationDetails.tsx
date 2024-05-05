import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import {
  EventConfigurationFragment,
  ItemFragment,
  LocationFragment,
  StockEntriesFragment,
  StockFragment,
} from '../apollo/schema';
import ItemRow, { Variant } from '../components/ItemRow';
import { LogisticsParamsList } from '../components/LogisticNavigation';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import { getNodes } from '../helpers/apollo';

export default function LocationDetails({
  location,
  refetch,
  stateReloading,
  event: { items: itemsConnection, itemGroups: itemGroupConnection },
  stockEntriesConnection,
  enableLogisticsLinks = false,
}: {
  location: LocationFragment;
  event: EventConfigurationFragment;
  stockEntriesConnection?: StockEntriesFragment | null;
  stateReloading: boolean;
  refetch: () => void;
  enableLogisticsLinks?: boolean;
}) {
  const itemGroups = getNodes(itemGroupConnection);
  const items = getNodes(itemsConnection);
  const stockEntries = getNodes(stockEntriesConnection);

  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();

  const handlePress = (stock: StockFragment) => () => {
    navigation.navigate('stack', {
      screen: 'stock-item',
      params: { stock },
    });
  };

  return (
    <NativeScreen style={styles.screen}>
      <SectionList
        sections={itemGroups.map((itemGroup) => ({
          id: itemGroup.id,
          name: itemGroup.name,
          data: items
            .filter((item) => item.itemGroup.id === itemGroup.id)
            .map((item) => ({
              item,
              stockEntry: stockEntries.find(
                (stockEntries) =>
                  stockEntries.item.id === item.id &&
                  stockEntries.location.id === location.id,
              ),
            }))
            .filter(function (row): row is {
              item: ItemFragment;
              stockEntry: StockFragment;
            } {
              return !!row.stockEntry;
            }),
        }))}
        refreshing={stateReloading}
        onRefresh={refetch}
        keyExtractor={(row) => row.item.id}
        renderItem={({ item: { item, stockEntry } }) => (
          <ItemRow
            item={item}
            stockEntry={stockEntry}
            variant={Variant.NameAndUnit}
            handlePress={
              enableLogisticsLinks ? handlePress(stockEntry) : () => null
            }
          />
        )}
        renderSectionHeader={({ section: { name, id } }) => (
          <View style={styles.row} key={id}>
            <NativeText>{name}</NativeText>
          </View>
        )}
      />
    </NativeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'stretch' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderColor: colors.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    paddingVertical: 10,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
});
