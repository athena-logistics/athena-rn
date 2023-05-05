import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  ItemFragment,
  LocationFragment,
  StockEntryStatus,
  StockFragment,
} from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import LiveStockEntry from './LiveStockEntry';
import NativeText from './native/NativeText';

export enum Variant {
  NameAndUnit,
  Location,
}

export default function ItemRow({
  item,
  stockEntry,
  handlePress,
  variant,
  ...restProps
}: {
  item: ItemFragment;
  stockEntry: StockFragment;
  handlePress?: () => void;
  variant: Variant;
} & (
  | { variant: Variant.NameAndUnit }
  | { variant: Variant.Location; location: LocationFragment }
)) {
  const style = styles({
    isInverse: variant === Variant.NameAndUnit ? item.inverse : false,
  });

  let color: string;
  switch (stockEntry.status) {
    case StockEntryStatus.Important:
      color = colors.red;
      break;
    case StockEntryStatus.Warning:
      color = colors.orange;
      break;
    case StockEntryStatus.Normal:
      color = colors.green;
      break;
  }

  return (
    <View style={style.row}>
      <View style={style.status}>
        <Octicons name="dot-fill" size={30} color={color} />
      </View>
      <View style={style.title}>
        <TouchableOpacity onPress={handlePress}>
          {variant === Variant.NameAndUnit && (
            <>
              <NativeText style={style.titleText}>{item.name}</NativeText>
              <NativeText style={style.subtitleText}>{item.unit}</NativeText>
            </>
          )}
          {variant === Variant.Location && 'location' in restProps && (
            <NativeText style={style.titleText}>
              {restProps.location.name}
            </NativeText>
          )}
        </TouchableOpacity>
      </View>
      <View style={style.leftContainer}>
        <LiveStockEntry stockEntry={stockEntry} />
      </View>
    </View>
  );
}

const styles = ({ isInverse }: { isInverse: boolean }) =>
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
    status: { marginRight: 10 },
    title: { overflow: 'hidden', justifyContent: 'center', flex: 1 },
    titleText: {
      fontSize: 18,
      fontFamily: fonts.defaultFontFamilyBold,
      color: isInverse ? colors.secondary : colors.primary,
      flex: 1,
      flexWrap: 'wrap',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 10,
    },
    subtitleText: {
      fontSize: 12,
    },
  });
