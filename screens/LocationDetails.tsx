import { useMutation } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput } from '../apollo/schema';
import {
  useInternalLocationId,
  useLocationStockQuery,
} from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import ItemRow from '../components/ItemRow';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import isAndroid from '../constants/isAndroid';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { PermissionEnum } from '../models/PermissionEnum';
import { RootState } from '../store';

const LocationDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });
  const route = useRoute();
  // @ts-ignore
  const location: LogisticLocation = route.params?.location;
  // @ts-ignore
  const externalLocationId: string = route.params?.externalLocationId;

  const locationPermissionOnly =
    useSelector((state: RootState) => state.global.currentPermission) ===
    PermissionEnum.LocationUser;
  const eventName = useSelector((state: RootState) => state.global.eventName);

  const { data } = useInternalLocationId(externalLocationId);
  const internalLocationId = data?.location?.id;
  const locationName = data?.location?.name;
  const currentLocationId = internalLocationId || location?.id;

  const [fetch, { loading }] = useLocationStockQuery(currentLocationId);

  const fetchTimer = useRef<any>();
  useMovementSubscription({
    onSubscriptionData: () => {
      if (fetchTimer.current) {
        clearTimeout(fetchTimer.current);
      }
      fetchTimer.current = setTimeout(fetch, 1000);
    },
  });

  useEffect(() => {
    fetch();
  }, [currentLocationId]);

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    if (locationPermissionOnly) {
      navigation.setOptions({
        headerBackVisible: false,
      });
    }

    if (eventName && locationPermissionOnly) {
      navigation.setOptions({
        title: `${locationName}`,
        headerRight: () => (
          <NativeText
            style={{ color: isAndroid ? colors.white : colors.primary }}
          >
            {eventName}
          </NativeText>
        ),
      });
    }
  }, [navigation, locationName, eventName, locationPermissionOnly]);

  const locationData = useSelector(
    (state: RootState) => state.global.locationStock[currentLocationId]
  );
  let itemList: StockItem[] = [];
  if (locationData) {
    itemList = Object.values(locationData.itemById).sort(
      (row1, row2) => row1.stock - row2.stock
    );
  }
  const [createConsumeMutation, { loading: consumeLoading }] =
    useMutation<ConsumeInput>(DO_CONSUME, {
      onError: (error) => {
        console.log('error', error);
        fetch();
      },
      onCompleted: (data) => {
        // @ts-ignore
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
          // refetch after an error
          fetch();
        }
      },
    });

  return (
    <NativeScreen style={style.screen}>
      <SectionList
        sections={getGroupedData(itemList).map((x) => ({
          id: x.id,
          name: x.name,
          data: x.children,
        }))}
        refreshing={loading}
        onRefresh={fetch}
        // @ts-ignore
        keyExtractor={(item) => item.id + item.locationId}
        renderItem={({ item }) => (
          <ItemRow
            row={item as StockItem}
            loading={loading}
            createConsumeMutation={createConsumeMutation}
            variant={'nameAndUnit'}
          />
        )}
        renderSectionHeader={({ section: { name, id } }) => (
          <View style={style.row} key={id}>
            <NativeText>{name}</NativeText>
          </View>
        )}
      />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
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
  });

export default LocationDetails;
