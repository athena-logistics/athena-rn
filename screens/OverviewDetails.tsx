import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';

const OverviewDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const route = useRoute();
  // @ts-ignore
  const row: OverviewRow = route.params?.row;

  const getStatusIcon = (): { iconName: any; iconColor: string } => {
    switch (row.status as StockEntryStatus) {
      case StockEntryStatus.Normal:
        return { iconName: 'airplane', iconColor: 'green' };
      case StockEntryStatus.Important:
        return { iconName: 'airplane', iconColor: 'orange' };
      case StockEntryStatus.Warning:
      default:
        return { iconName: 'airplane', iconColor: 'red' };
    }
  };

  const { iconName, iconColor } = getStatusIcon();

  return (
    <NativeScreen style={style.screen}>
      <View style={style.row}>
        <View style={style.title}>
          <NativeText style={style.titleText}>{row.itemName}</NativeText>
          <NativeText style={style.subtitleText}>{row.locationName}</NativeText>
        </View>
        <View style={style.leftContainer}>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.stock}</NativeText>
            <NativeText style={style.numberText}>in stock</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.consumption}</NativeText>
            <NativeText style={style.numberText}>consumption</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.movementIn}</NativeText>
            <NativeText style={style.numberText}>movement in</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.movementOut}</NativeText>
            <NativeText style={style.numberText}>movement out</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.itemGroupName}</NativeText>
            <NativeText style={style.numberText}>item group</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{row.supply}</NativeText>
            <NativeText style={style.numberText}>supply</NativeText>
          </View>
          <View style={style.status}>
            <Ionicons name={iconName} size={23} color={iconColor} />
          </View>
        </View>
      </View>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch', justifyContent: 'flex-start' },
    row: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    leftContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {},
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

export default OverviewDetails;
