import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import NativeText from './native/NativeText';

const LocationRow = ({ row }: { row: LogisticLocation }) => {
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
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Location Stock By Item', { location: row });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={style.row}>
        <View style={style.title}>
          <NativeText style={style.titleText}>{row.name}</NativeText>
        </View>
        <View style={style.leftContainer}>
          <View style={style.status}>
            <Ionicons name={iconName} size={23} color={iconColor} />
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
    title: { overflow: 'hidden', flex: 1 },
    titleText: {
      fontSize: 20,
      fontFamily: fonts.defaultFontFamilyBold,
    },
    subtitleText: {
      fontSize: 12,
    },
    numberContainer: { alignItems: 'center' },
    numberText: { fontSize: 12, textTransform: 'uppercase' },
    number: { fontSize: 20, fontFamily: fonts.defaultFontFamilyBold },
    status: { marginLeft: 20 },
  });

export default LocationRow;
