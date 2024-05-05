import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationProp,
} from '@react-navigation/native';
import { useContext, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { LocationDetailsQuery } from '../apollo/schema';
import { getTabBarIcon } from '../helpers/icon';
import { defaultScreenOptionsDrawer } from '../helpers/navigationOptions';
import LocationDetails from '../screens/LocationDetails';
import Logout from '../screens/Logout';
import Map from '../screens/Map';
import AppInfo from './AppInfo';
import { RootParamsList } from './AuthorizationNavigation';
import { BrandedDrawerWithTitle } from './BrandedDrawerContent';
import { SentryRoutingInstrumentationContext } from '../contexts/sentry';

export type VendorParamsList = {
  'location-details': undefined;
  map: undefined;
  logout: undefined;
  info: undefined;
};

const AppDrawer = createDrawerNavigator<VendorParamsList>();

export default function VendorNavigation({
  refetch,
  stateReloading,
  location,
  rootNavigation,
  subscribeToNewMovements,
}: {
  refetch: () => void;
  stateReloading: boolean;
  location: Exclude<LocationDetailsQuery['location'], null | undefined>;
  rootNavigation: NavigationProp<RootParamsList>;
  subscribeToNewMovements: () => void;
}) {
  useEffect(() => subscribeToNewMovements(), []);

  const routingInstrumentation = useContext(
    SentryRoutingInstrumentationContext,
  );

  const intl = useIntl();

  const navigation = useRef<NavigationContainerRef<RootParamsList>>(null);

  return (
    <NavigationContainer
      independent={true}
      ref={navigation}
      onReady={() =>
        routingInstrumentation?.registerNavigationContainer(navigation)
      }
    >
      <AppDrawer.Navigator
        initialRouteName="location-details"
        screenOptions={defaultScreenOptionsDrawer}
        drawerContent={(props) => (
          <BrandedDrawerWithTitle {...props} title={location.event.name} />
        )}
      >
        <AppDrawer.Screen
          name="location-details"
          options={{
            drawerIcon: getTabBarIcon({ name: 'list-outline' }),
            headerTitle: location.name,
            drawerLabel: intl.formatMessage({
              id: 'screen.overview',
              defaultMessage: 'Overview',
            }),
            lazy: true,
          }}
        >
          {(props) => (
            <LocationDetails
              {...props}
              location={location}
              event={location.event}
              refetch={refetch}
              stockEntriesConnection={location.stock}
              stateReloading={stateReloading}
            />
          )}
        </AppDrawer.Screen>
        <AppDrawer.Screen
          name="map"
          component={Map}
          options={{
            headerTitle: intl.formatMessage({
              id: 'screen.map',
              defaultMessage: 'Map',
            }),
            drawerIcon: getTabBarIcon({ name: 'map-outline' }),
            drawerLabel: intl.formatMessage({
              id: 'screen.map',
              defaultMessage: 'Map',
            }),
            lazy: true,
          }}
        />
        <AppDrawer.Screen
          name="logout"
          options={{
            drawerIcon: getTabBarIcon({ name: 'log-out-outline' }),
            lazy: true,
            unmountOnBlur: true,
            headerTitle: intl.formatMessage({
              id: 'screen.logout',
              defaultMessage: 'Logout',
            }),
            drawerLabel: intl.formatMessage({
              id: 'screen.logout',
              defaultMessage: 'Logout',
            }),
          }}
        >
          {() => <Logout navigation={rootNavigation} />}
        </AppDrawer.Screen>
        <AppDrawer.Screen
          name="info"
          component={AppInfo}
          options={{
            drawerIcon: getTabBarIcon({ name: 'information-circle-outline' }),
            lazy: false,
            unmountOnBlur: true,
            headerTitle: intl.formatMessage({
              id: 'screen.appInfo',
              defaultMessage: 'Info',
            }),
            drawerLabel: intl.formatMessage({
              id: 'screen.appInfo',
              defaultMessage: 'Info',
            }),
          }}
        />
      </AppDrawer.Navigator>
    </NavigationContainer>
  );
}
