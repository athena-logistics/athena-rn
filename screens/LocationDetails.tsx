import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useLocationStockQuery } from '../apolloActions/useQueries';
import NativeScreen from '../components/native/NativeScreen';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import isAndroid from '../constants/isAndroid';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { RootState } from '../store';
import LocationDetailsManageStock from './LocationDetailsManageStock';
import LocationDetailsOverview from './LocationDetailsOverview';

const LocationTab = createMaterialTopTabNavigator();
const LocationDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const LocationTabs = () => {
    const route = useRoute();
    // @ts-ignore
    const location: LogisticLocation = route.params?.location;
    const [refetch] = useLocationStockQuery(location?.id);
    const locationStock = useSelector(
      (state: RootState) => state.global.locationStock[location?.id]
    );
    let availableItems: AvailableItemGroup[] = [];
    if (locationStock) {
      availableItems = locationStock.availableItems;
    }

    const navigation = useNavigation();
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: location?.name,
      });
    }, [navigation]);

    const defaultScreenOptionsTab: MaterialTopTabNavigationOptions = {
      tabBarStyle: {
        backgroundColor: isAndroid ? colors.primary : 'white',
      },
      tabBarInactiveTintColor: isAndroid ? colors.primaryLight : colors.primary,
      tabBarLabelStyle: {
        fontFamily: fonts.defaultFontFamilyBold,
      },
      tabBarIndicatorStyle: { backgroundColor: colors.primary },
      tabBarActiveTintColor: isAndroid ? 'white' : colors.primary,
    };

    return (
      <LocationTab.Navigator screenOptions={defaultScreenOptionsTab}>
        <LocationTab.Screen
          name="Location Details Overview"
          component={LocationDetailsOverview}
          options={{
            title: 'Overview',
          }}
        />
        <LocationTab.Screen
          name="Location Manage Stock"
          component={LocationDetailsManageStock}
          options={{
            title: 'Manage Stock',
          }}
        />
      </LocationTab.Navigator>
    );
  };
  return (
    <NativeScreen style={style.screen}>
      {/* {availableItems.map((group) => (
        <View>
          <NativeText>Group: {group.name}</NativeText>
          {group.children.map((item) => (
            <View>
              <NativeText>
                {item.name} {item.stock}
              </NativeText>
            </View>
          ))}
        </View>
      ))}
       */}
      <LocationTabs />
      {/* <OverviewByItem locationId={location?.id} /> */}
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default LocationDetails;
