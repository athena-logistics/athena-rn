import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { RootState } from '../store';
import NativeText from './native/NativeText';

const OverviewItemRow = ({ group }: { group: AvailableItemGroup }) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const getGroupNameIcon = (name: string) => {
    switch (name) {
      case 'Becher':
        return (
          <Entypo
            name={'cup'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Bier':
        return (
          <Ionicons
            name={'beer'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Diverses':
        return (
          <Feather
            name={'box'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Softdrinks':
        return (
          <MaterialCommunityIcons
            name={'bottle-soda'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
      case 'Wein':
        return (
          <MaterialCommunityIcons
            name={'glass-wine'}
            size={20}
            color={colors.primary}
            style={{ marginRight: 5 }}
          />
        );
    }
  };
  const allStock = useSelector((state: RootState) => state.global.allStock);
  const getNumberOfItemsPerStatus = (item: Item, status: StockEntryStatus) => {
    return allStock.filter(
      (stock) => stock.id === item.id && stock.status === status
    ).length;
  };

  const navigation = useNavigation();
  const handlePress = (item: Item) => () => {
    // @ts-ignore
    navigation.navigate('Item Details', { item });
  };

  return (
    <View style={style.itemContainer}>
      <View style={style.headerItem}>
        {getGroupNameIcon(group.name)}
        <NativeText type="bold" style={style.headerText}>
          {group.name}
        </NativeText>
      </View>
      <View style={style.items}>
        {group.children.map((item) => (
          <Pressable
            onPress={handlePress(item)}
            key={item.id}
            style={style.item}
          >
            <View style={style.texts}>
              <NativeText style={style.itemText}>{item.name}</NativeText>

              <NativeText style={style.itemSubtitleText}>
                {item.unit}
              </NativeText>
            </View>
            <View style={style.numberContainer}>
              {/* <MaterialCommunityIcons
              name="home-group"
              size={18}
              color={colors.primary}
            /> */}
              {/* <Entypo name={'cup'} size={20} color={colors.red} /> */}
              <NativeText
                style={{
                  ...style.numberText,
                  ...style.IMPORTANT,
                  fontSize: 20,
                }}
                type={'bold'}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Important)}
              </NativeText>
              <NativeText
                style={{
                  ...style.numberText,
                  ...style.WARNING,
                  fontSize: 16,
                }}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Warning)}
              </NativeText>
              <NativeText
                style={{
                  ...style.numberText,
                  ...style.NORMAL,
                  fontSize: 12,
                }}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Normal)}
              </NativeText>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    itemContainer: {
      width: '100%',
    },
    headerItem: {
      paddingHorizontal: 5,
      margin: 3,
      flexDirection: 'row',
    },
    items: { flexWrap: 'wrap', flexDirection: 'row' },
    texts: { flex: 8, justifyContent: 'space-between' },
    item: {
      paddingVertical: 5,
      paddingHorizontal: 5,
      width: 120,
      // height: 80,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primary,
      margin: 3,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    numberContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    headerText: { fontSize: 16 },
    itemText: { fontSize: 14 },
    itemSubtitleText: { fontSize: 12, color: colors.grey },
    numberText: { fontSize: 16, marginLeft: 8 },

    NORMAL: { color: colors.green },
    IMPORTANT: { color: colors.red },
    WARNING: { color: colors.orange },
    icon: {
      // color: 'transparent',
      textShadowColor: colors.primary,
      textShadowRadius: 1,
      marginRight: 2,
    },
  });

export default OverviewItemRow;
