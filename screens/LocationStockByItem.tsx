import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useLocationStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';
import StockByItem from './StockByItem';

const LocationStockByItem = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });
  const route = useRoute();
  // @ts-ignore
  const location: LogisticLocation = route.params?.location;

  const [fetch, { loading }] = useLocationStockQuery(location.id);

  useMovementSubscription({
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, [location]);

  const locationData = useSelector(
    (state: RootState) => state.global.locationStock[location.id]
  );
  let data: StockItem[] = [];
  if (locationData) {
    data = Object.values(locationData.itemById).sort(
      (row1, row2) => row1.stock - row2.stock
    );
  }

  return (
    <NativeScreen style={style.screen}>
      <StockByItem itemList={data} fetch={fetch} loading={loading} />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default LocationStockByItem;
