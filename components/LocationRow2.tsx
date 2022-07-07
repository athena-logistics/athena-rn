import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import NativeText from './native/NativeText';

const LocationRow2 = ({ row }: { row: LogisticLocation }) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const getStatusIcon = (): { iconName: any; iconColor: string } => {
    switch (row.status as StockEntryStatus) {
      case StockEntryStatus.Normal:
        return { iconName: 'airplane', iconColor: 'green' };
      case StockEntryStatus.Warning:
        return { iconName: 'airplane', iconColor: 'orange' };
      case StockEntryStatus.Important:
      default:
        return { iconName: 'airplane', iconColor: 'red' };
    }
  };

  const { iconName, iconColor } = getStatusIcon();

  const navigation = useNavigation();

  return (
    <View style={style.row}>
      {row.stockItems.map((item) => (
        <View style={style.cell} key={item.id}>
          <NativeText>{item.stock}</NativeText>
        </View>
      ))}
    </View>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    cell: { width: 60 },
    leftContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: { overflow: 'hidden', flex: 1 },
    subtitleText: {
      fontSize: 12,
    },
    numberText: { fontSize: 12, textTransform: 'uppercase' },
    number: { fontSize: 20, fontFamily: fonts.defaultFontFamilyBold },
    status: { marginLeft: 20 },
  });

export default LocationRow2;
