import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import {
  ItemFragment,
  LogisticEventConfigurationFragment,
  StockFragment,
} from '../apollo/schema';
import ItemRow, { Variant } from '../components/ItemRow';
import { LogisticsParamsList } from '../components/LogisticNavigation';
import NativeScreen from '../components/native/NativeScreen';
import { getNodes } from '../helpers/apollo';

export default function ItemDetails({
  item,
  event,
  refetch,
  stateReloading,
}: {
  item: ItemFragment;
  event: LogisticEventConfigurationFragment;
  stateReloading: boolean;
  refetch: () => void;
}) {
  const locations = getNodes(event.locations);
  const itemStock = getNodes(event.stock).filter(
    (stock) => stock.item.id === item.id,
  );

  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();

  const handlePress = (stock: StockFragment) => () => {
    navigation.navigate('stack', {
      screen: 'stock-item',
      params: { stock },
    });
  };

  return (
    <NativeScreen style={styles.screen}>
      <FlatList
        data={itemStock}
        onRefresh={refetch}
        refreshing={stateReloading}
        renderItem={({ item: stockEntry }) => {
          const location = locations.find(
            (location) => location.id === stockEntry.location.id,
          );
          if (!location) return null;
          return (
            <ItemRow
              stockEntry={stockEntry}
              item={item}
              location={location}
              variant={Variant.Location}
              handlePress={handlePress(stockEntry)}
            />
          );
        }}
        keyExtractor={(row) => row.location.id}
      />
    </NativeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'stretch' },
});
