import i18n from '../helpers/i18n';
import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import NativeText from './native/NativeText';
import { StockItem } from '../models/StockItem';

const MissingItemRow = ({
  row,
  onPress,
}: {
  row: StockItem;
  onPress: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.title}>
          <View style={styles.titleRow}>
            <NativeText style={styles.titleText}>{row.name}</NativeText>
          </View>
          <NativeText style={styles.subtitleText}>
            {row.locationName}
          </NativeText>
        </View>
        <View style={styles.leftContainer}>
          {!row.inverse && (
            <NativeText style={styles.unitText}>{i18n.t('missing')}</NativeText>
          )}
          <View style={styles.status}>
            <NativeText
              style={{
                ...styles.statusTextMissing,
                color:
                  row.status === StockEntryStatus.Important
                    ? colors.red
                    : row.status === StockEntryStatus.Warning
                    ? colors.orange
                    : colors.primary,
              }}
              type="bold"
            >
              {row.missingCount}
            </NativeText>
            <NativeText style={styles.unitText}>{row.unit}</NativeText>
          </View>
          <NativeText style={styles.unitText}>{i18n.t('outOf')}</NativeText>
          <View style={styles.status}>
            <NativeText style={styles.statusTextTotal} type="bold">
              {row.inverse ? 0 : row.stock + row.missingCount}
            </NativeText>
            <NativeText style={styles.unitText}>TOTAL</NativeText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

export default MissingItemRow;
