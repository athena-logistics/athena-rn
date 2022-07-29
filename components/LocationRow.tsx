import { Entypo } from '@expo/vector-icons';
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

  const getNumberOfItemsPerStatus = (status: StockEntryStatus) => {
    return row.stockItems.filter((item) => item.status === status).length;
  };

  const navigation = useNavigation();
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Location Overview', { location: row });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={style.row}>
        <View style={style.title}>
          <NativeText style={style.titleText}>{row.name}</NativeText>
        </View>
        <View style={style.leftContainer}>
          <View style={style.status}>
            <NativeText style={style.statusText}>
              {getNumberOfItemsPerStatus(StockEntryStatus.Important)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.red} />
          </View>
          <View style={style.status}>
            <NativeText style={style.statusText}>
              {getNumberOfItemsPerStatus(StockEntryStatus.Warning)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.orange} />
          </View>
          <View style={style.status}>
            <NativeText style={style.statusText}>
              {getNumberOfItemsPerStatus(StockEntryStatus.Normal)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.green} />
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
    status: {
      width: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      color: colors.primary,
    },
    statusText: {
      fontSize: 16,
    },
  });

export default LocationRow;
