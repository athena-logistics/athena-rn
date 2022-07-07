import { ApolloProvider } from '@apollo/client';
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import React from 'react';
import { LogBox, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import client from './apollo';
import colors from './constants/colors';
import fonts from './constants/fonts';
import isAndroid from './constants/isAndroid';
import ItemTypes from './screens/ItemTypes';
import LocationStockByGroup from './screens/LocationStockByGroup';
import LocationStockByItem from './screens/LocationStockByItem';
import Move from './screens/Move';
import Scanner from './screens/Scanner';
import StockByLocation from './screens/StockByLocation';
import StockItemDetails from './screens/StockItemDetails';
import Supply from './screens/Supply';
import store from './store';

if (__DEV__) {
  LogBox.ignoreLogs(['Overwriting fontFamily style attribute preprocessor']);
}

const getTabBarIcon =
  ({ name }: { name: any }) =>
  ({ color }: { color: string }) =>
    <Ionicons name={name} size={23} color={color} />;

const App = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    'Avenir-Black': require('./assets/fonts/Avenir-Black.otf'),
    'Avenir-Book': require('./assets/fonts/Avenir-Book.otf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const defaultScreenOptions: BottomTabNavigationOptions = {
    headerStyle: {
      backgroundColor: isAndroid ? colors.primary : '',
    },
    headerTintColor: isAndroid ? 'white' : colors.primary,
    headerShadowVisible: true,
    headerTitleStyle: {
      fontFamily: fonts.defaultFontFamilyBold,
    },
    tabBarActiveTintColor: colors.primary,
  };
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
  const defaultScreenOptionsStack: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: isAndroid ? colors.primary : '',
    },
    headerTintColor: isAndroid ? 'white' : colors.primary,
    headerShadowVisible: true,
    headerTitleStyle: {
      fontFamily: fonts.defaultFontFamilyBold,
    },
  };

  const OverviewTab = createMaterialTopTabNavigator();
  const OverviewTabs = () => {
    return (
      <OverviewTab.Navigator screenOptions={defaultScreenOptionsTab}>
        {/* <OverviewTab.Screen name="Big table" component={StockByLocation2} /> */}
        {/* <OverviewTab.Screen name="All Items" component={AllStockByItem} /> */}
        <OverviewTab.Screen name="By Item Type" component={ItemTypes} />
        <OverviewTab.Screen name="By Location" component={StockByLocation} />
      </OverviewTab.Navigator>
    );
  };

  const OverviewStack = createNativeStackNavigator();
  const OverviewStackNavigator = () => (
    <OverviewStack.Navigator screenOptions={defaultScreenOptionsStack}>
      <OverviewStack.Screen name="Overview" component={OverviewTabs} />
      <OverviewStack.Screen
        name="Stock Item Details"
        component={StockItemDetails}
      />
      <OverviewStack.Screen
        name="Location Stock By Item"
        component={LocationStockByItem}
        options={(props) => ({
          // @ts-ignore
          title: props.route.params?.location?.name,
        })}
      />
      <OverviewStack.Screen
        name="Location Stock By Group"
        component={LocationStockByGroup}
      />
    </OverviewStack.Navigator>
  );

  const AppTabs = createBottomTabNavigator();
  const AppTabNavigator = () => (
    <AppTabs.Navigator
      screenOptions={defaultScreenOptions}
      initialRouteName="Overview"
    >
      <AppTabs.Screen
        name="Overview Stack"
        component={OverviewStackNavigator}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ios-list-outline' }),
          headerShown: false,
          headerTitle: 'Overview',
        }}
      />
      <AppTabs.Screen
        name="Move"
        component={Move}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ios-log-out-outline' }),
        }}
      />
      <AppTabs.Screen
        name="Supply"
        component={Supply}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ios-log-in-outline' }),
        }}
      />
      <AppTabs.Screen
        name="Scanner"
        component={Scanner}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ios-qr-code-outline' }),
        }}
      />
    </AppTabs.Navigator>
  );

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <AppTabNavigator />
        </NavigationContainer>
      </ApolloProvider>
      <Toast />
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
