import { Entypo } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { LogisticLocation } from '../models/LogisticLocation';
import NativeText from './native/NativeText';
import { OverviewStackParamsList } from './Navigation';

const LocationRow = ({ row }: { row: LogisticLocation }) => {
  const getNumberOfItemsPerStatus = (status: StockEntryStatus) => {
    return row.stockItems.filter((item) => item.status === status).length;
  };

  const navigation = useNavigation<NavigationProp<OverviewStackParamsList>>();
  const handlePress = () => {
    navigation.navigate('Location Details', { location: row });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.row}>
        <View style={styles.title}>
          <NativeText style={styles.titleText}>{row.name}</NativeText>
        </View>
        <View style={styles.leftContainer}>
          <View style={styles.status}>
            <NativeText
              style={{ ...styles.statusText, fontSize: 20, color: colors.red }}
              type="bold"
            >
              {getNumberOfItemsPerStatus(StockEntryStatus.Important)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.red} />
          </View>
          <View style={styles.status}>
            <NativeText
              style={{
                ...styles.statusText,
                fontSize: 16,
                color: colors.orange,
              }}
              type="bold"
            >
              {getNumberOfItemsPerStatus(StockEntryStatus.Warning)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.orange} />
          </View>
          <View style={styles.status}>
            <NativeText
              style={{
                ...styles.statusText,
                fontSize: 12,
                color: colors.green,
              }}
              type="bold"
            >
              {getNumberOfItemsPerStatus(StockEntryStatus.Normal)}
            </NativeText>
            <Entypo name={'cup'} size={30} color={colors.green} />
          </View>
        </View>
      </View>
    </Pressable>
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
