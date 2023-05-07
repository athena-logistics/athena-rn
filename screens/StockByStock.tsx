import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Cell } from 'react-native-reanimated-table';
import {
  ItemFragment,
  ItemGroupFragment,
  LocationFragment,
  LogisticEventConfigurationFragment,
  StockFragment,
} from '../apollo/schema';
import DoubleStickyTable, {
  DynamicCellType,
} from '../components/DoubleStickyTable';
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

  const table = tableData(locations, itemGroups, items, stock);
  const printableTable: DynamicCellType[][] = table.map((row) =>
    row.map((cell) => {
      switch (cell.type) {
        case CellType.Refresh:
          return {
            style: styles.cornerCell,
            data: (
              <TouchableOpacity
                onPress={refetch}
                style={{ alignItems: 'center' }}
              >
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
            ),
          };
        case CellType.Location:
          return {
            style: [styles.topCell],
            data: (
              <TouchableOpacity onPress={handleLocationPress(cell.location)}>
                <NativeText
                  style={styles.topCellText}
                  ellipsizeMode="tail"
                  numberOfLines={3}
                >
                  {cell.location.name}
                </NativeText>
              </TouchableOpacity>
            ),
          };
        case CellType.ItemGroup:
          return ({ transposed }) => ({
            style: styles.topGroupCell,
            data: (
              <NativeText
                style={styles.topGroupCellText}
                ellipsizeMode="tail"
                numberOfLines={transposed ? 5 : 3}
              >
                {cell.itemGroup.name}
              </NativeText>
            ),
          });
        case CellType.ItemGroupSpacer:
          return { style: styles.groupCell, data: null };
        case CellType.Item:
          return ({ transposed }) => ({
            style: [styles.topCell],
            data: (
              <TouchableOpacity onPress={handleItemPress(cell.item)}>
                <NativeText
                  style={styles.topCellText}
                  ellipsizeMode="tail"
                  numberOfLines={transposed ? 5 : 3}
                >
                  {cell.item.name} ({cell.item.unit})
                </NativeText>
              </TouchableOpacity>
            ),
          });
        case CellType.Stock:
          if (!cell.stock) {
            return {
              style: [styles.cell],
              data: (
                <NativeText style={styles.cellText}>
                  <FormattedNumber value={0} />
                </NativeText>
              ),
            };
          }

          return {
            style: [styles.cell, styles[cell.stock.status]],
            data: (
              <TouchableOpacity onPress={handleStockItemPress(cell.stock)}>
                <NativeText
                  style={[styles.cellText, styles[`${cell.stock.status}text`]]}
                >
                  <FormattedNumber value={cell.stock.stock} />
                </NativeText>
              </TouchableOpacity>
            ),
          };
      }
    })
  );

  const horizontalColumnEquivalentCount = locations.length + 2;
  const transposedHorizontalColumnEquivalentCount =
    items.length + itemGroups.length + 1;

  const columnWidth = Math.max(width / horizontalColumnEquivalentCount, 60);
  const transposedColumnWidth = Math.max(
    width / transposedHorizontalColumnEquivalentCount,
    70
  );

  return (
    <DoubleStickyTable
      table={printableTable}
      widthArr={[2 * columnWidth, ...Array(locations.length).fill(columnWidth)]}
      transposedWidthArr={[
        columnWidth,
        ...Array(items.length + itemGroups.length).fill(transposedColumnWidth),
      ]}
      heightArr={[
        50,
        ...itemGroups.flatMap((itemGroup) => [
          25,
          ...items
            .filter((item) => item.itemGroup.id === itemGroup.id)
            .map(() => 50),
        ]),
      ]}
      transposedHeightArr={[75, ...Array(locations.length).fill(50)]}
      refreshing={stateReloading}
      onRefresh={refetch}
    />
  );
}

enum CellType {
  Refresh,
  Location,
  ItemGroup,
  ItemGroupSpacer,
  Item,
  Stock,
}

type Cell =
  | { type: CellType.Refresh }
  | { type: CellType.Location; location: LocationFragment }
  | { type: CellType.ItemGroup; itemGroup: ItemGroupFragment }
  | { type: CellType.ItemGroupSpacer }
  | { type: CellType.Item; item: ItemFragment }
  | {
      type: CellType.Stock;
      item: ItemFragment;
      location: LocationFragment;
      stock: StockFragment | null;
    };

function tableData(
  locations: LocationFragment[],
  itemGroups: ItemGroupFragment[],
  items: ItemFragment[],
  stock: StockFragment[]
): Cell[][] {
  return [
    [
      { type: CellType.Refresh },
      ...locations.map(
        (location): Cell => ({
          type: CellType.Location,
          location,
        })
      ),
    ],
    ...itemGroups.flatMap((itemGroup): Cell[][] => [
      [
        { type: CellType.ItemGroup, itemGroup },
        ...locations.map((): Cell => ({ type: CellType.ItemGroupSpacer })),
      ],
      ...items
        .filter((item) => item.itemGroup.id === itemGroup.id)
        .map((item): Cell[] => [
          { type: CellType.Item, item },
          ...locations.map(
            (location): Cell => ({
              type: CellType.Stock,
              item,
              location,
              stock:
                stock.find(
                  (stock) =>
                    stock.item.id === item.id &&
                    stock.location.id === location.id
                ) ?? null,
            })
          ),
        ]),
    ]),
  ];
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
  topGroupCell: {
    padding: 5,
    backgroundColor: colors.primaryLight,
  },
  topGroupCellText: {
    fontSize: 12,
    color: colors.white,
  },
  topCell: {
    padding: 5,
    borderColor: colors.primary,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
  },
  topCellText: { fontSize: 12 },
  NORMAL: { backgroundColor: colors.green },
  IMPORTANT: { backgroundColor: colors.red },
  WARNING: { backgroundColor: colors.orange },
  NORMALtext: { color: colors.black },
  IMPORTANTtext: { color: colors.black },
  WARNINGtext: { color: colors.black },
});
