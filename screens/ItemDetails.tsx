import { useMutation } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput } from '../apollo/schema';
import { useAllStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import ItemRow from '../components/ItemRow';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const ItemDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  let eventId: string;

  const route = useRoute();
  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);
  // @ts-ignore
  const item: Item = route.params?.item;

  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locationStock = allStock.filter((stock) => stock.id === item.id);

  const fetchTimer = useRef<any>();
  useMovementSubscription({
    onSubscriptionData: () => {
      console.log('subscription updated');
      if (fetchTimer.current) {
        clearTimeout(fetchTimer.current);
      }
      fetchTimer.current = setTimeout(fetchStock, 500);
    },
  });

  const [createConsumeMutation, { loading: consumeLoading }] =
    useMutation<ConsumeInput>(DO_CONSUME, {
      onError: (error) => console.log('error', error),
      onCompleted: (data) => {
        // @ts-ignore
        console.log('completed messages:', data.consume.messages);
        // @ts-ignore
        if (data.consume.messages.length > 0) {
          // @ts-ignore
          data.consume.messages.forEach((message) => {
            if (message.__typename === 'ValidationMessage') {
              console.log('error', message.field + ' ' + message.message);
              Toast.show({
                type: 'error',
                text1: 'error',
                text2: message.field + ' ' + message.message,
              });
            }
          });
        }
        // fetchStock();
      },
    });

  const renderRow = ({ item }: { item: StockItem }) => {
    return (
      <ItemRow
        row={item}
        loading={loadingStock || consumeLoading}
        createConsumeMutation={createConsumeMutation}
        variant={'location'}
      />
    );
  };

  return (
    <NativeScreen style={style.screen}>
      <FlatList
        data={locationStock}
        onRefresh={fetchStock}
        refreshing={loadingStock || consumeLoading}
        renderItem={renderRow}
        keyExtractor={(row) => row.locationId}
      />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default ItemDetails;
