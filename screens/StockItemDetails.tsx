import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  LogisticEventConfigurationFragment,
  StockEntryStatus,
  StockFragment,
} from '../apollo/schema';
import LiveStockEntry from '../components/LiveStockEntry';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { getNodes } from '../helpers/apollo';

export default function StockItemDetails({
  stockEntry,
  event,
}: {
  stockEntry: StockFragment;
  event: LogisticEventConfigurationFragment;
}) {
  const item = getNodes(event.items).find(
    (item) => item.id === stockEntry.item.id
  );
  if (!item) throw new Error('Inconsistent State');
  const itemGroup = getNodes(event.itemGroups).find(
    (itemGroup) => itemGroup.id === item.itemGroup.id
  );
  if (!itemGroup) throw new Error('Inconsistent State');
  const location = getNodes(event.locations).find(
    (location) => location.id === stockEntry.location.id
  );
  if (!location) throw new Error('Inconsistent State');

  return (
    <ScrollView>
      <View style={styles.item}>
        <View style={styles.title}>
          <View style={styles.status}>
            <Octicons
              name="dot-fill"
              size={30}
              color={getIconColor(stockEntry.status)}
            />
          </View>
          <View>
            <NativeText style={styles.titleText}>{location.name}</NativeText>
            <NativeText>{item.name}</NativeText>
          </View>
        </View>
        <View style={styles.leftContainer}>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>{itemGroup.name}</NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.itemGroup"
                defaultMessage="Item Group"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>{item.unit} </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage id="model.item.unit" defaultMessage="Unit" />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>
              <FormattedNumber value={stockEntry.stock} />
            </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.stock"
                defaultMessage="Stock"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>
              <FormattedNumber value={stockEntry.consumption} />
            </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.consumption"
                defaultMessage="Consumption"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>
              <FormattedNumber value={stockEntry.movementIn} />
            </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.movementIn"
                defaultMessage="Movement In"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>
              <FormattedNumber value={stockEntry.movementOut} />
            </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.movementOut"
                defaultMessage="Movement Out"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>{stockEntry.supply}</NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.supply"
                defaultMessage="Supply"
              />
            </NativeText>
          </View>
          <View style={styles.numberContainer}>
            <NativeText style={styles.number}>
              <FormattedNumber value={stockEntry.missingCount} />
            </NativeText>
            <NativeText style={styles.numberText}>
              <FormattedMessage
                id="model.stockEntry.missingCount"
                defaultMessage="Missing"
              />
            </NativeText>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <LiveStockEntry stockEntry={stockEntry} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'stretch', justifyContent: 'flex-start' },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leftContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
  status: { marginRight: 10 },
  titleText: {
    fontSize: 20,
    fontFamily: fonts.defaultFontFamilyBold,
  },
  subtitleText: {
    fontSize: 12,
  },
  numberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  numberText: {
    fontSize: 12,
    textTransform: 'uppercase',
    paddingLeft: 5,
  },
  number: {
    fontSize: 20,
    fontFamily: fonts.defaultFontFamilyBold,
    flexBasis: '50%',
    textAlign: 'right',
    paddingRight: 5,
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  numberInputStyle: {
    fontSize: 36,
    color: colors.primary,
    fontFamily: fonts.defaultFontFamily,
  },
});

function getIconColor(status: StockEntryStatus): string {
  switch (status) {
    case StockEntryStatus.Normal:
      return colors.green;
    case StockEntryStatus.Important:
      return colors.red;
    case StockEntryStatus.Warning:
    default:
      return colors.orange;
  }
}
