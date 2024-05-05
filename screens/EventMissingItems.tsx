import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  ItemFragment,
  LocationFragment,
  LogisticEventConfigurationFragment,
  StockFragment,
} from '../apollo/schema';
import { LogisticsParamsList } from '../components/LogisticNavigation';
import MissingItemRow from '../components/MissingItemRow';
import NativeButton from '../components/native/NativeButton';
import NativePicker from '../components/native/NativePicker';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import { getNodes } from '../helpers/apollo';

export default function EventMissingItems({
  event,
  refetch,
  stateReloading,
}: {
  event: LogisticEventConfigurationFragment;
  refetch: () => void;
  stateReloading: boolean;
}) {
  const intl = useIntl();

  const items = getNodes(event.items);
  const stock = getNodes(event.stock);
  const locations = getNodes(event.locations);

  const groupedItems = Object.entries(
    items
      .map((item) => ({ ...item, name: `${item.name} (${item.unit})` }))
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.itemGroup.id]: [...(acc[item.itemGroup.id] ?? []), item],
        }),
        {} as Record<string, ItemFragment[]>,
      ),
  ).map(([itemGroupId, items]) => {
    const itemGroup = getNodes(event.itemGroups).find(
      (itemGroup) => itemGroup.id === itemGroupId,
    );

    return {
      ...itemGroup,
      children: items,
    };
  });

  const [locationFilter, setLocationFilter] = useState<LocationFragment[]>([]);
  const [itemFilter, setItemFilter] = useState<ItemFragment[]>([]);

  const filteredStock = stock.filter((stockItem) => {
    if (stockItem.missingCount < 1) return false;
    if (locationFilter.length > 0) {
      const locationMatches = locationFilter.some(
        (location) => location.id === stockItem.location.id,
      );
      if (!locationMatches) return false;
    }
    if (itemFilter.length > 0) {
      const itemMatches = itemFilter.some(
        (item) => item.id === stockItem.item.id,
      );
      if (!itemMatches) return false;
    }

    return true;
  });

  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();
  const handleMoveAll = () => {
    navigation.navigate('move', {
      to: locationFilter[0],
      items: filteredStock.map((stockEntry) => ({
        amount: stockEntry.missingCount,
        item: items.find((item) => item.id === stockEntry.item.id) ?? null,
      })),
    });
  };
  const handleRowClick = (stockEntry: StockFragment) => () => {
    navigation.navigate('move', {
      items: [
        {
          amount: stockEntry.missingCount,
          item: items.find((item) => item.id === stockEntry.item.id) ?? null,
        },
      ],
      to: locations.find((location) => location.id === stockEntry.location.id),
    });
  };
  return (
    <NativeScreen style={styles.screen}>
      <View style={styles.top}>
        <NativePicker
          uniqueKey="id"
          items={locations}
          selectedItems={locationFilter.map((location) => location.id)}
          onSelectedItemsChange={() => null}
          onSelectedItemObjectsChange={(locations) =>
            setLocationFilter(locations as LocationFragment[])
          }
          readOnlyHeadings={false}
          selectText={intl.formatMessage({
            id: 'model.location',
            defaultMessage: 'Location',
          })}
          renderSelectText={({ selectText }) => {
            return <NativeText>{selectText}</NativeText>;
          }}
        />
        <NativeText> </NativeText>
        <NativePicker
          uniqueKey="id"
          items={groupedItems}
          subKey="children"
          selectedItems={itemFilter.map((item) => item.id)}
          onSelectedItemsChange={() => null}
          onSelectedItemObjectsChange={(items) =>
            setItemFilter(items as ItemFragment[])
          }
          readOnlyHeadings={true}
          selectText={intl.formatMessage({
            id: 'model.item',
            defaultMessage: 'Item',
          })}
          renderSelectText={({ selectText }) => {
            return <NativeText>{selectText}</NativeText>;
          }}
        />
      </View>
      {(filteredStock.length > 0 && (
        <>
          {locationFilter.length === 1 && (
            <View style={styles.buttons}>
              <NativeButton
                title={intl.formatMessage({
                  id: 'missingItem.supplyAll',
                  defaultMessage: 'Supply all',
                })}
                onPress={handleMoveAll}
              ></NativeButton>
            </View>
          )}
          <View>
            <FlatList
              data={filteredStock}
              onRefresh={refetch}
              refreshing={stateReloading}
              renderItem={({ item: stockEntry }) => {
                const item = items.find(
                  (item) => item.id === stockEntry.item.id,
                );
                const location = locations.find(
                  (location) => location.id === stockEntry.location.id,
                );
                if (!location || !item)
                  throw new Error('Inconsistent Internal State');
                return (
                  <MissingItemRow
                    stockEntry={stockEntry}
                    item={item}
                    location={location}
                    onPress={handleRowClick(stockEntry)}
                  />
                );
              }}
              keyExtractor={(row) => row.item.id + row.location.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </>
      )) || (
        <NativeText>
          <FormattedMessage
            id="missingItem.nothingMissing"
            defaultMessage="Congratulations, nothing is missing."
          />
        </NativeText>
      )}
    </NativeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexWrap: 'wrap',
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
