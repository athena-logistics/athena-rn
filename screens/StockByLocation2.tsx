import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useAllStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import LocationRow2 from '../components/LocationRow2';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { getLocationData } from '../helpers/getLocationData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { LogisticLocation } from '../models/LogisticLocation';
import { RootState } from '../store';

const StockByLocation = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  let eventId: string;

  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetch, { loading }] = useAllStockQuery(eventId);

  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locationData = getLocationData(allStock);

  useMovementSubscription({
    onSubscriptionData: () => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, [eventId]);

  const renderRow = ({ item }: { item: LogisticLocation }) => {
    return <LocationRow2 row={item} key={item.id} />;
  };

  const handlePress = (location: LogisticLocation) => {
    // @ts-ignore
    navigation.navigate('Location Stock By Item', { location });
  };

  return (
    <ReactNativeZoomableView
      // maxZoom={30}
      // // Give these to the zoomable view so it can apply the boundaries around the actual content.
      // // Need to make sure the content is actually centered and the width and height are
      // // dimensions when it's rendered naturally. Not the intrinsic size.
      // // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
      // // Therefore, we'll feed the zoomable view the 300x150 size.
      contentWidth={locationData[6]?.stockItems.length * 60}
      contentHeight={locationData.length * 10}
    >
      <View>
        <View style={style.screen}>
          <View style={style.header}>
            {locationData.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={style.headerCell}
                onPress={() => handlePress(location)}
              >
                <NativeText style={style.titleText}>{location.name}</NativeText>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <View style={style.row}>
              <View style={style.cell} />
              {locationData[5]?.stockItems.map((i) => (
                <View style={style.cell} key={i.id}>
                  <NativeText style={style.cellText}>{i.name}</NativeText>
                </View>
              ))}
            </View>
            <FlatList
              data={locationData}
              onRefresh={fetch}
              refreshing={loading}
              renderItem={renderRow}
              keyExtractor={(row) => row.id}
            />
          </View>
        </View>
      </View>
    </ReactNativeZoomableView>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { flexDirection: 'row' },
    row: {
      flexDirection: 'row',
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    cell: {
      width: 60,
    },
    cellText: {
      transform: [{ rotate: '-45 deg' }],
      fontSize: 12,
    },
    headerCell: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    header: {
      paddingTop: 70,
      flexDirection: 'column',
    },
    list: {
      alignSelf: 'flex-start',
    },
    titleText: {
      fontSize: 16,
      fontFamily: fonts.defaultFontFamilyBold,
    },
  });

export default StockByLocation;
