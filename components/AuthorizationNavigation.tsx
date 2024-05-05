import { ApolloProvider } from '@apollo/client';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React, { useContext, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import client from '../apollo';
import colors from '../constants/colors';
import { SentryRoutingInstrumentationContext } from '../contexts/sentry';
import {
  Type,
  loadInitialState,
  persistState,
} from '../helpers/persistentAuthorization';
import GuestNavigation from './GuestNavigation';
import LogisticsContext from './LogisticsContext';
import VendorContext from './VendorContext';

const prefixes = ['athena-rn://', Linking.createURL('/')];

export type RootParamsList = {
  init: undefined;
  guest: undefined;
  vendor: {
    apiHost: string;
    locationId: string;
  };
  logistics: {
    apiHost: string;
    eventId: string;
  };
};

const RootNavigator = createBottomTabNavigator<RootParamsList>();

export default function AuthorizationNavigation(): JSX.Element | null {
  const routingInstrumentation = useContext(
    SentryRoutingInstrumentationContext,
  );

  const navigation = useRef<NavigationContainerRef<RootParamsList>>(null);

  return (
    <NavigationContainer
      linking={{
        enabled: true,
        prefixes: prefixes,
        config: {
          screens: {
            guest: 'guest',
            vendor: 'vendor/:apiHost/:locationId',
            logistics: 'logistics/:apiHost/:eventId',
          },
        },
      }}
      fallback={<ActivityIndicator size={'large'} color={colors.primary} />}
      ref={navigation}
      onReady={() =>
        routingInstrumentation?.registerNavigationContainer(navigation)
      }
    >
      <RootNavigator.Navigator
        screenListeners={(navigation) => ({
          focus: () => persistRouteChange(navigation.route),
        })}
        screenOptions={{ headerShown: false, unmountOnBlur: true, lazy: true }}
        tabBar={() => null}
      >
        <RootNavigator.Screen name="init" component={Init} />
        <RootNavigator.Screen name="guest" component={GuestNavigation} />
        <RootNavigator.Screen name="vendor">
          {(props) => (
            <ApolloProvider client={client(props.route.params.apiHost)}>
              <VendorContext
                locationId={props.route.params.locationId}
                rootNavigation={props.navigation}
              />
            </ApolloProvider>
          )}
        </RootNavigator.Screen>
        <RootNavigator.Screen name="logistics">
          {(props) => (
            <ApolloProvider client={client(props.route.params.apiHost)}>
              <LogisticsContext
                eventId={props.route.params.eventId}
                rootNavigation={props.navigation}
              />
            </ApolloProvider>
          )}
        </RootNavigator.Screen>
      </RootNavigator.Navigator>
    </NavigationContainer>
  );
}

function Init() {
  const navigation = useNavigation<NavigationProp<RootParamsList>>();

  async function redirectToArea() {
    const state = await loadInitialState();

    switch (state.type) {
      case Type.Guest:
        return navigation.navigate('guest');
      case Type.Vendor:
        return navigation.navigate('vendor', {
          apiHost: state.apiHost,
          locationId: state.locationId,
        });
      case Type.Logistics:
        return navigation.navigate('logistics', {
          apiHost: state.apiHost,
          eventId: state.eventId,
        });
    }
  }

  useFocusEffect(() => {
    redirectToArea();
  });

  return <ActivityIndicator size={'large'} color={colors.primary} />;
}

function persistRouteChange(
  route: RouteProp<RootParamsList, keyof RootParamsList>,
) {
  switch (route.name) {
    case 'guest':
      return persistState({ type: Type.Guest });
    case 'vendor':
      return persistState({
        type: Type.Vendor,
        apiHost: (route as RouteProp<RootParamsList, 'vendor'>).params.apiHost,
        locationId: (route as RouteProp<RootParamsList, 'vendor'>).params
          .locationId,
      });
    case 'logistics':
      return persistState({
        type: Type.Logistics,
        apiHost: (route as RouteProp<RootParamsList, 'logistics'>).params
          .apiHost,
        eventId: (route as RouteProp<RootParamsList, 'logistics'>).params
          .eventId,
      });
  }
}
