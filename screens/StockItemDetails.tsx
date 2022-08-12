import { Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import i18n from 'i18n-js';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StockEntryStatus } from '../apollo/schema';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';

const StockItemDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const route = useRoute();

  // @ts-ignore
  const item: StockItem = route.params?.stockItem;
  if (!item) {
    return null;
  }

  const getStatusIcon = (): { iconColor: string } => {
    switch (item.status as StockEntryStatus) {
      case StockEntryStatus.Normal:
        return { iconColor: colors.green };
      case StockEntryStatus.Important:
        return { iconColor: colors.red };
      case StockEntryStatus.Warning:
      default:
        return { iconColor: colors.orange };
    }
  };

  const { iconColor } = getStatusIcon();

  return (
    <NativeScreen style={style.screen}>
      <View style={style.item}>
        <View style={style.title}>
          <View style={style.status}>
            <Octicons name="dot-fill" size={30} color={iconColor} />
          </View>
          <View>
            <NativeText style={style.titleText}>{item.locationName}</NativeText>
            <NativeText>{item.name}</NativeText>
          </View>
        </View>
        <View style={style.leftContainer}>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.itemGroupName}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('itemGroup')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.unit}</NativeText>
            <NativeText style={style.numberText}>{i18n.t('unit')}</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.stock}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('inStock')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.consumption}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('consumption')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.movementIn}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('movementIn')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.movementOut}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('movementOut')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.supply}</NativeText>
            <NativeText style={style.numberText}>{i18n.t('supply')}</NativeText>
          </View>
        </View>
      </View>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
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
  });

export default StockItemDetails;
