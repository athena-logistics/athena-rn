import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import isAndroid from '../constants/isAndroid';

export const defaultScreenOptionsBottomTab: BottomTabNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerShadowVisible: true,
  headerTitleStyle: {
    fontFamily: fonts.defaultFontFamilyBold,
  },
  tabBarActiveTintColor: colors.white,
  tabBarInactiveTintColor: colors.primaryLight,
  tabBarActiveBackgroundColor: colors.primary,
  tabBarInactiveBackgroundColor: colors.primary,
  tabBarStyle: {
    backgroundColor: colors.primary,
    paddingBottom: isAndroid ? 5 : 15,
  },
};

export const defaultScreenOptionsStack: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerShadowVisible: true,
  headerTitleStyle: {
    fontFamily: fonts.defaultFontFamilyBold,
  },
};

export const defaultScreenOptionsDrawer: DrawerNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerShadowVisible: true,
  headerTitleStyle: {
    fontFamily: fonts.defaultFontFamilyBold,
  },
};
