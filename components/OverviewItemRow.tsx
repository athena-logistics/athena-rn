import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  ItemFragment,
  ItemGroupFragment,
  LogisticEventConfigurationFragment,
  StockEntryStatus,
} from '../apollo/schema';
import colors from '../constants/colors';
import { getNodes } from '../helpers/apollo';
import { LogisticsParamsList } from './LogisticNavigation';
import NativeText from './native/NativeText';

export default function OverviewItemRow({
  event,
  itemGroup,
}: {
  event: LogisticEventConfigurationFragment;
  itemGroup: ItemGroupFragment;
}) {
  const items = getNodes(event.items).filter(
    (item) => item.itemGroup.id === itemGroup.id
  );
  const eventStock = getNodes(event.stock);

  const getNumberOfItemsPerStatus = (
    item: ItemFragment,
    status: StockEntryStatus
  ) => {
    return eventStock.filter(
      (stock) => stock.item.id === item.id && stock.status === status
    ).length;
  };

  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();
  const handlePress = (item: ItemFragment) => () => {
    navigation.navigate('stack', {
      screen: 'item',
      params: { item },
    });
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.headerItem}>
        {getGroupNameIcon(itemGroup.name)}
        <NativeText type="bold" style={styles.headerText}>
          {itemGroup.name}
        </NativeText>
      </View>
      <View style={styles.items}>
        {items.map((item) => (
          <Pressable
            onPress={handlePress(item)}
            key={item.id}
            style={styles.item}
          >
            <View style={styles.texts}>
              <NativeText style={styles.itemText}>{item.name}</NativeText>

              <NativeText style={styles.itemSubtitleText}>
                {item.unit}
              </NativeText>
            </View>
            <View style={styles.numberContainer}>
              {/* <MaterialCommunityIcons
                    name="home-group"
                    size={18}
                    color={colors.primary}
                  /> */}
              {/* <Entypo name={'cup'} size={20} color={colors.red} /> */}
              <NativeText
                style={{
                  ...styles.numberText,
                  ...styles.IMPORTANT,
                  fontSize: 20,
                }}
                type={'bold'}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Important)}
              </NativeText>
              <NativeText
                style={{
                  ...styles.numberText,
                  ...styles.WARNING,
                  fontSize: 16,
                }}
              >
                {getNumberOfItemsPerStatus(item, StockEntryStatus.Warning)}
              </NativeText>
              <NativeText
                style={{
                  ...styles.numberText,
                  ...styles.NORMAL,
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
}

const styles = StyleSheet.create({
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

function getGroupNameIcon(name: string) {
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
}
