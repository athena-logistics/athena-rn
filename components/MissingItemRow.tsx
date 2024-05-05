import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ItemFragment,
  LocationFragment,
  StockEntryStatus,
  StockFragment,
} from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import NativeText from './native/NativeText';

export default function MissingItemRow({
  stockEntry,
  item,
  location,
  onPress,
}: {
  stockEntry: StockFragment;
  item: ItemFragment;
  location: LocationFragment;
  onPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.title}>
          <View style={styles.titleRow}>
            <NativeText style={styles.titleText}>{item.name}</NativeText>
          </View>
          <NativeText style={styles.subtitleText}>{location.name}</NativeText>
        </View>
        <View style={styles.leftContainer}>
          <View style={styles.status}>
            <NativeText
              style={{
                ...styles.statusTextMissing,
                color:
                  stockEntry.status === StockEntryStatus.Important
                    ? colors.red
                    : stockEntry.status === StockEntryStatus.Warning
                      ? colors.orange
                      : colors.primary,
              }}
              type="bold"
            >
              {stockEntry.missingCount}
            </NativeText>
            <NativeText style={styles.unitText}>{item.unit}</NativeText>
          </View>
          <NativeText style={styles.unitText}>
            <FormattedMessage id="missingItem.outOf" defaultMessage="out of" />
          </NativeText>
          <View style={styles.status}>
            <NativeText style={styles.statusTextTotal} type="bold">
              {item.inverse ? 0 : stockEntry.stock + stockEntry.missingCount}
            </NativeText>
            <NativeText style={styles.unitText}>
              <FormattedMessage id="missingItem.total" defaultMessage="total" />
            </NativeText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end' },
  title: { overflow: 'hidden', flex: 1 },
  titleText: {
    fontSize: 18,
    fontFamily: fonts.defaultFontFamilyBold,
  },
  unitText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  subtitleText: {
    fontSize: 14,
  },
  numberContainer: { alignItems: 'center' },
  numberText: { fontSize: 12, textTransform: 'uppercase' },
  number: { fontSize: 20, fontFamily: fonts.defaultFontFamilyBold },
  status: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: colors.primary,
  },
  statusTextMissing: {
    fontSize: 20,
  },
  statusTextTotal: {
    fontSize: 20,
  },
});
