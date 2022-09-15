import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from '@react-navigation/material-bottom-tabs';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import i18n from 'i18n-js';
import React from 'react';
import 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import isAndroid from '../constants/isAndroid';
import { PermissionEnum } from '../models/PermissionEnum';
import EventMissingItems from '../screens/EventMissingItems';
import ItemDetails from '../screens/ItemDetails';
import ItemOverview from '../screens/ItemOverview';
import LocationDetails from '../screens/LocationDetails';
import LocationOverview from '../screens/LocationOverview';
import Map from '../screens/Map';
import Move from '../screens/Move';
import Scanner from '../screens/Scanner';
import StockItemDetails from '../screens/StockItemDetails';
import Supply from '../screens/Supply';
import { RootState } from '../store';
import NativeText from './native/NativeText';

const Navigation = () => {
  const getTabBarIcon =
    ({ name }: { name: any }) =>
    ({ color }: { color: string }) =>
      <Ionicons name={name} size={23} color={color} />;

  const currentPermission = useSelector(
    (state: RootState) => state.global.currentPermission
  );
  const eventName = useSelector((state: RootState) => state.global.eventName);

  const isEventAdmin = () => currentPermission === PermissionEnum.EventAdmin;
  console.log('isadmin', isEventAdmin());
  const isLocationUser = () =>
    currentPermission === PermissionEnum.LocationUser;

  const defaultScreenOptionsBottomTab: MaterialBottomTabNavigationOptions = {
    tabBarColor: colors.primary,
  };
  const defaultScreenOptionsTopTab: MaterialTopTabNavigationOptions = {
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

  const defaultScreenOptionsStack: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: isAndroid ? colors.primary : colors.white,
    },
    headerTintColor: isAndroid ? 'white' : colors.primary,
    headerShadowVisible: true,
    headerTitleStyle: {
      fontFamily: fonts.defaultFontFamilyBold,
    },
  };

  const OverviewTab = createMaterialTopTabNavigator();
  const OverviewTabs: React.FC = () => {
    return (
      <OverviewTab.Navigator screenOptions={defaultScreenOptionsTopTab}>
        <OverviewTab.Screen
          name="By Location"
          component={LocationOverview}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="home-group"
                size={24}
                color={
                  isAndroid
                    ? focused
                      ? colors.white
                      : colors.primaryLight
                    : colors.primary
                }
              />
            ),
            title: i18n.t('byLocation'),
          }}
        />
        <OverviewTab.Screen
          name="By Item"
          component={ItemOverview}
          options={{
            title: i18n.t('byItem'),
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="food-fork-drink"
                size={24}
                color={
                  isAndroid
                    ? focused
                      ? colors.white
                      : colors.primaryLight
                    : colors.primary
                }
              />
            ),
          }}
        />
        <OverviewTab.Screen
          name="Missing items"
          component={EventMissingItems}
          options={{
            title: i18n.t('eventMissingItems'),
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={24}
                color={
                  isAndroid
                    ? focused
                      ? colors.white
                      : colors.primaryLight
                    : colors.primary
                }
              />
            ),
          }}
        />
      </OverviewTab.Navigator>
    );
  };

  const OverviewStack = createNativeStackNavigator();
  const OverviewStackNavigator = () => (
    <OverviewStack.Navigator screenOptions={defaultScreenOptionsStack}>
      {isEventAdmin() ? (
        <OverviewStack.Screen
          name="Overview"
          component={OverviewTabs}
          options={() => ({
            title: i18n.t('overview'),
            headerRight: () => (
              <NativeText
                style={{ color: isAndroid ? colors.white : colors.primary }}
              >
                {eventName}
              </NativeText>
            ),
          })}
        />
      ) : null}
      <OverviewStack.Screen
        name="Stock Item Details"
        component={StockItemDetails}
        options={(props) => ({
          // @ts-ignore
          title: props.route.params?.stockItem?.name,
        })}
      />
      <OverviewStack.Screen
        name="Supply screen"
        component={Supply}
        options={{
          headerTitle: i18n.t('supply'),
          title: i18n.t('supply'),
        }}
      />
      <OverviewStack.Screen
        name="Location Details"
        component={LocationDetails}
        options={(props) => ({
          // @ts-ignore
          title: props.route.params?.location?.name,
        })}
      />
      {isEventAdmin() ? (
        <OverviewStack.Screen
          name="Item Details"
          component={ItemDetails}
          options={(props) => ({
            // @ts-ignore
            title: props.route.params?.item?.name,
          })}
        />
      ) : null}
    </OverviewStack.Navigator>
  );

  const MoveStack = createNativeStackNavigator();
  const MoveStackNavigatior = () => (
    <MoveStack.Navigator screenOptions={defaultScreenOptionsStack}>
      <MoveStack.Screen
        name="Move"
        component={Move}
        options={{
          headerTitle: i18n.t('move'),
          title: i18n.t('move'),
        }}
      />
    </MoveStack.Navigator>
  );

  const SupplyStack = createNativeStackNavigator();
  const SupplyStackNavigatior = () => (
    <SupplyStack.Navigator screenOptions={defaultScreenOptionsStack}>
      <SupplyStack.Screen
        name="Supply"
        component={Supply}
        options={{
          headerTitle: i18n.t('supply'),
          title: i18n.t('supply'),
        }}
      />
    </SupplyStack.Navigator>
  );
  const MapStack = createNativeStackNavigator();
  const MapStackNavigatior = () => (
    <MapStack.Navigator screenOptions={defaultScreenOptionsStack}>
      <MapStack.Screen
        name="Map"
        component={Map}
        options={{
          headerTitle: i18n.t('map'),
          title: i18n.t('map'),
          headerRight: () => (
            <NativeText
              style={{ color: isAndroid ? colors.white : colors.primary }}
            >
              {eventName}
            </NativeText>
          ),
        }}
      />
    </MapStack.Navigator>
  );

  const ScannerStack = createNativeStackNavigator();
  const ScannerStackNavigatior = () => (
    <ScannerStack.Navigator screenOptions={defaultScreenOptionsStack}>
      <ScannerStack.Screen
        name="Scanner"
        component={Scanner}
        options={{
          headerTitle: i18n.t('scanner'),
          title: i18n.t('scanner'),
        }}
      />
    </ScannerStack.Navigator>
  );

  const AppTabs = createMaterialBottomTabNavigator();
  const AppTabNavigator = () => (
    <AppTabs.Navigator
      screenOptions={defaultScreenOptionsBottomTab}
      shifting={false}
      barStyle={{ backgroundColor: colors.primary }}
      activeColor={colors.white}
      inactiveColor={colors.primaryLight}
    >
      {isEventAdmin() || isLocationUser() ? (
        <AppTabs.Screen
          name="Overview Stack"
          component={OverviewStackNavigator}
          options={{
            tabBarIcon: getTabBarIcon({
              name: 'ios-list-outline',
            }),
            tabBarLabel: i18n.t('overview'),
            title: i18n.t('overview'),
          }}
        />
      ) : null}
      {isEventAdmin() ? (
        <AppTabs.Screen
          name="Move Stack"
          component={MoveStackNavigatior}
          options={{
            tabBarIcon: getTabBarIcon({ name: 'ios-log-out-outline' }),
            tabBarLabel: i18n.t('move'),
          }}
        />
      ) : null}
      {isEventAdmin() ? (
        <AppTabs.Screen
          name="Supply Stack"
          component={SupplyStackNavigatior}
          options={{
            tabBarIcon: getTabBarIcon({ name: 'ios-log-in-outline' }),
            tabBarLabel: i18n.t('supply'),
          }}
        />
      ) : null}
      {/* {isEventAdmin() || isLocationUser() ? (
        <AppTabs.Screen
          name="Map Stack"
          component={MapStackNavigatior}
          options={{
            tabBarIcon: getTabBarIcon({ name: 'ios-map-outline' }),
            tabBarLabel: i18n.t('map'),
          }}
        />
      ) : null} */}
      <AppTabs.Screen
        name="Scanner Stack"
        component={ScannerStackNavigatior}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ios-qr-code-outline' }),
          tabBarLabel: i18n.t('scanner'),
        }}
      />
    </AppTabs.Navigator>
  );

  return <AppTabNavigator />;
};
export default Navigation;
