import i18n from 'i18n-js';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import NativeText from './native/NativeText';

const MissingItemRow = ({ row }: { row: StockItem }) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  return (
    <Pressable>
      <View style={style.row}>
        <View style={style.title}>
          <View style={style.titleRow}>
            <NativeText style={style.titleText}>{row.name}</NativeText>
          </View>
          <NativeText style={style.subtitleText}>{row.locationName}</NativeText>
        </View>
        <View style={style.leftContainer}>
          <NativeText style={style.unitText}>{i18n.t('missing')}</NativeText>
          <View style={style.status}>
            <NativeText style={style.statusTextMissing} type="bold">
              {row.missingCount}
            </NativeText>
            <NativeText style={style.unitText}>{row.unit}</NativeText>
          </View>
          <NativeText style={style.unitText}>{i18n.t('outOf')}</NativeText>
          <View style={style.status}>
            <NativeText style={style.statusTextTotal} type="bold">
              {row.missingCount + row.stock}
            </NativeText>
            <NativeText style={style.unitText}>TOTAL</NativeText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
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
      color: colors.red,
    },
    statusTextTotal: {
      fontSize: 20,
    },
  });

export default MissingItemRow;
