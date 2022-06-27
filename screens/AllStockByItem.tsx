import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';
import StockByItem from './StockByItem';

const AllStockByItem = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });
  const route = useRoute();

  let eventId: string;

  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetch, { loading }] = useAllStockQuery(eventId);

  useMovementSubscription({
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, [eventId]);

  const getData = () => {
    return useSelector((state: RootState) => state.global.allStock);
  };

  return (
    <NativeScreen style={style.screen}>
      <StockByItem itemList={getData()} fetch={fetch} loading={loading} />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
    actions: {
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      width: '100%',
    },
  });

export default AllStockByItem;
