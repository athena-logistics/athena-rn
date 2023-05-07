import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DrawerToggleButton,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {
  NavigationContainer,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
  EventDetailsQuery,
  ItemFragment,
  LocationFragment,
  StockFragment,
} from '../apollo/schema';
import colors from '../constants/colors';
import { getNodes } from '../helpers/apollo';
import { getTabBarIcon } from '../helpers/icon';
import {
  defaultScreenOptionsBottomTab,
  defaultScreenOptionsDrawer,
  defaultScreenOptionsStack,
} from '../helpers/navigationOptions';
import EventMissingItems from '../screens/EventMissingItems';
import ItemDetails from '../screens/ItemDetails';
import ItemOverview from '../screens/ItemOverview';
import LocationDetails from '../screens/LocationDetails';
import LocationOverview from '../screens/LocationOverview';
import Logout from '../screens/Logout';
import Map from '../screens/Map';
import Move from '../screens/Move';
import { ItemState } from '../screens/Move/store';
import StockByStock from '../screens/StockByStock';
import StockItemDetails from '../screens/StockItemDetails';
import AppInfo from './AppInfo';
import { RootParamsList } from './AuthorizationNavigation';
import { BrandedDrawerWithTitle } from './BrandedDrawerContent';
import NativeText from './native/NativeText';

export type LogisticsParamsList = {
  stack: NavigatorScreenParams<LogisticStackParamsList> | undefined;
  move:
    | {
        items?: ItemState[];
        from?: LocationFragment;
        to?: LocationFragment;
      }
    | undefined;
  map: undefined;
  logout: undefined;
  info: undefined;
};

export type OverviewTabsParamsList = {
  all: undefined;
  location: undefined;
  item: undefined;
  'missing-items': undefined;
};

export type LogisticStackParamsList = {
  overview: NavigatorScreenParams<OverviewTabsParamsList> | undefined;
  location: {
    location: LocationFragment;
  };
  item: {
    item: ItemFragment;
  };
  'stock-item': {
    stock: StockFragment;
  };
};

const AppDrawer = createDrawerNavigator<LogisticsParamsList>();
const OverviewStack = createNativeStackNavigator<LogisticStackParamsList>();
const OverviewTab = createBottomTabNavigator<OverviewTabsParamsList>();

export default function LogisticNavigation({
  refetch,
  event,
  stateReloading,
  rootNavigation,
  subscribeToNewMovements,
}: {
  event: Exclude<EventDetailsQuery['event'], null | undefined>;
  refetch: () => void;
  stateReloading: boolean;
  rootNavigation: NavigationProp<RootParamsList>;
  subscribeToNewMovements: () => void;
}) {
  useEffect(() => subscribeToNewMovements(), []);

  const intl = useIntl();

  return (
    <NavigationContainer independent={true}>
      <AppDrawer.Navigator
        initialRouteName="stack"
        screenOptions={defaultScreenOptionsDrawer}
        drawerContent={(props) => (
          <BrandedDrawerWithTitle {...props} title={event.name} />
        )}
      >
        <AppDrawer.Screen
          name="stack"
          options={{
            drawerIcon: getTabBarIcon({ name: 'ios-list-outline' }),
            headerShown: false,
            drawerLabel: intl.formatMessage({
              id: 'screen.overview',
              defaultMessage: 'Overview',
            }),
            lazy: true,
          }}
        >
          {(props) => (
            <OverviewStack.Navigator
              {...props}
              screenOptions={defaultScreenOptionsStack}
            >
              <OverviewStack.Screen
                name="overview"
                options={() => ({
                  headerShown: false,
                })}
              >
                {(props) => (
                  <OverviewTab.Navigator
                    {...props}
                    screenOptions={{
                      ...defaultScreenOptionsBottomTab,
                      headerLeft: (props) => <DrawerToggleButton {...props} />,
                    }}
                  >
                    <OverviewTab.Screen
                      name="all"
                      options={{
                        tabBarIcon: ({ focused }) => (
                          <MaterialCommunityIcons
                            name="view-dashboard"
                            size={24}
                            color={focused ? colors.white : colors.primaryLight}
                          />
                        ),
                        title: intl.formatMessage({
                          id: 'screen.overview',
                          defaultMessage: 'Overview',
                        }),
                      }}
                    >
                      {(props) => (
                        <StockByStock
                          {...props}
                          event={event}
                          refetch={refetch}
                          stateReloading={stateReloading}
                        />
                      )}
                    </OverviewTab.Screen>
                    <OverviewTab.Screen
                      name="location"
                      options={{
                        tabBarIcon: ({ focused }) => (
                          <MaterialCommunityIcons
                            name="home-group"
                            size={24}
                            color={focused ? colors.white : colors.primaryLight}
                          />
                        ),
                        title: intl.formatMessage({
                          id: 'screen.overview.location',
                          defaultMessage: 'By Location',
                        }),
                      }}
                    >
                      {(props) => (
                        <LocationOverview
                          {...props}
                          event={event}
                          refetch={refetch}
                          stateReloading={stateReloading}
                        />
                      )}
                    </OverviewTab.Screen>

                    <OverviewTab.Screen
                      name="item"
                      options={{
                        title: intl.formatMessage({
                          id: 'screen.overview.item',
                          defaultMessage: 'By Item',
                        }),
                        tabBarIcon: ({ focused }) => (
                          <MaterialCommunityIcons
                            name="food-fork-drink"
                            size={24}
                            color={focused ? colors.white : colors.primaryLight}
                          />
                        ),
                      }}
                    >
                      {(props) => (
                        <ItemOverview
                          {...props}
                          event={event}
                          refetch={refetch}
                          stateReloading={stateReloading}
                        />
                      )}
                    </OverviewTab.Screen>
                    <OverviewTab.Screen
                      name="missing-items"
                      options={{
                        title: intl.formatMessage({
                          id: 'screen.overview.missingItems',
                          defaultMessage: 'Missing Items',
                        }),
                        tabBarIcon: ({ focused }) => (
                          <MaterialCommunityIcons
                            name="crosshairs-gps"
                            size={24}
                            color={focused ? colors.white : colors.primaryLight}
                          />
                        ),
                        tabBarBadge: getNodes(event.stock).filter(
                          (stockEntry) => stockEntry.missingCount > 0
                        ).length,
                      }}
                    >
                      {(props) => (
                        <EventMissingItems
                          {...props}
                          event={event}
                          refetch={refetch}
                          stateReloading={stateReloading}
                        />
                      )}
                    </OverviewTab.Screen>
                  </OverviewTab.Navigator>
                )}
              </OverviewStack.Screen>
              <OverviewStack.Screen
                name="stock-item"
                options={(props) => {
                  const item = getNodes(event.items).find(
                    (item) => item.id === props.route.params.stock.item.id
                  );
                  const itemGroup = getNodes(event.itemGroups).find(
                    (itemGroup) => itemGroup.id === item?.itemGroup.id
                  );
                  const location = getNodes(event.locations).find(
                    (location) =>
                      location.id === props.route.params.stock.location.id
                  );
                  return {
                    title: `${itemGroup?.name} / ${item?.name}`,
                    headerRight: () => (
                      <NativeText
                        style={{
                          color: colors.white,
                          padding: 10,
                        }}
                      >
                        {location?.name}
                      </NativeText>
                    ),
                  };
                }}
              >
                {(props) => (
                  <StockItemDetails
                    event={event}
                    stockEntry={props.route.params.stock}
                  />
                )}
              </OverviewStack.Screen>
              <OverviewStack.Screen
                name="location"
                options={(props) => ({
                  title: props.route.params.location.name,
                })}
              >
                {(props) => (
                  <LocationDetails
                    location={props.route.params.location}
                    event={event}
                    refetch={refetch}
                    stateReloading={stateReloading}
                    stockEntriesConnection={event.stock}
                    enableLogisticsLinks={true}
                  />
                )}
              </OverviewStack.Screen>

              <OverviewStack.Screen
                name="item"
                options={(props) => {
                  const itemGroup = getNodes(event.itemGroups).find(
                    (itemGroup) =>
                      itemGroup.id === props.route.params.item.itemGroup.id
                  );
                  return {
                    title: props.route.params.item.name,
                    headerRight: () => (
                      <NativeText
                        style={{
                          color: colors.white,
                          padding: 10,
                        }}
                      >
                        {itemGroup?.name}
                      </NativeText>
                    ),
                  };
                }}
              >
                {(props) => (
                  <ItemDetails
                    item={props.route.params.item}
                    event={event}
                    refetch={refetch}
                    stateReloading={stateReloading}
                  />
                )}
              </OverviewStack.Screen>
            </OverviewStack.Navigator>
          )}
        </AppDrawer.Screen>
        <AppDrawer.Screen
          name="move"
          options={{
            drawerIcon: getTabBarIcon({ name: 'arrow-forward-outline' }),
            lazy: true,
            headerTitle: intl.formatMessage({
              id: 'screen.move',
              defaultMessage: 'Move',
            }),
            drawerLabel: intl.formatMessage({
              id: 'screen.move',
              defaultMessage: 'Move',
            }),
          }}
        >
          {(props) => (
            <Move
              // Force Remount on Param Change
              key={`${props.route.params?.from?.id}-${props.route.params?.to?.id}-${props.route.params?.items?.length}`}
              event={event}
              from={props.route.params?.from}
              to={props.route.params?.to}
              items={props.route.params?.items}
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
            drawerIcon: getTabBarIcon({ name: 'ios-map-outline' }),
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
