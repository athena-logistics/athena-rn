import { createDrawerNavigator } from '@react-navigation/drawer';
import { useIntl } from 'react-intl';
import { getTabBarIcon } from '../helpers/icon';
import { defaultScreenOptionsDrawer } from '../helpers/navigationOptions';
import Scanner from '../screens/Scanner';
import AppInfo from './AppInfo';
import BrandedDrawerContent from './BrandedDrawerContent';

export type GuestParamsList = {
  scanner: undefined;
  info: undefined;
};

const AppDrawer = createDrawerNavigator<GuestParamsList>();

export default function GuestNavigation() {
  const intl = useIntl();

  return (
    <AppDrawer.Navigator
      initialRouteName="scanner"
      screenOptions={defaultScreenOptionsDrawer}
      drawerContent={BrandedDrawerContent}
    >
      <AppDrawer.Screen
        name="scanner"
        options={{
          drawerIcon: getTabBarIcon({ name: 'ios-qr-code-outline' }),
          lazy: true,
          unmountOnBlur: true,
          headerTitle: intl.formatMessage({
            id: 'screen.scanner',
            defaultMessage: 'Scanner',
          }),
          drawerLabel: intl.formatMessage({
            id: 'screen.scanner',
            defaultMessage: 'Scanner',
          }),
        }}
      >
        {() => <Scanner />}
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
  );
}
