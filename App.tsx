import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import 'expo-asset';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from 'expo-updates';
import i18n from 'i18n-js';
import React, { useEffect } from 'react';
import { Alert, LogBox, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import AppContent from './AppContent';
import store from './store';

if (__DEV__) {
  LogBox.ignoreLogs(['Overwriting fontFamily style attribute preprocessor']);
}

i18n.translations = {
  en: {
    supply: 'Supply',
    scanner: 'Scanner',
    move: 'Move',
    overview: 'Overview',
    byItem: 'By Item',
    byLocation: 'By Location',
    from: 'From...',
    to: 'To...',
    save: 'Save',
    locations: 'Locations',
    select: 'Select...',
    inStock: 'In Stock',
    consumption: 'Consumption',
    movementIn: 'Movements In',
    movementOut: 'Movements Out',
    itemGroup: 'Item Group',
    unit: 'Unit',
    yay: 'Yaay',
    successfulMove: 'Successfuly moved stuff.',
    ohNo: 'Oh No!',
    successfulSupply: 'Successfuly supplied stuff.',
    map: 'Map',
    eventMissingItems: 'Missing Items',
    missing: 'Missing',
    outOf: 'out of',
  },
  de: {
    supply: 'Anlieferung',
    scanner: 'Scanner',
    move: 'Verschiebung',
    overview: 'Übersicht',
    byItem: 'Nach Artikel',
    byLocation: 'Nach Standort',
    from: 'Von...',
    to: 'Zu...',
    save: 'Speichern',
    locations: 'Standorte',
    addNewStuff: 'Mehr Artikel hinzufügen',
    select: 'Auswählen...',
    inStock: 'am Standort',
    consumption: 'Konsumation',
    movementIn: 'eingehende Verschiebungen',
    movementOut: 'ausgehende Verschiebungen',
    itemGroup: 'Artikelgruppe',
    unit: 'Einheit',
    yay: 'Juhu',
    successfulMove: 'Erfolgreich verschoben',
    ohNo: 'Oh Nein!',
    successfulSupply: 'Erfolgreich angeliefert',
    map: 'Map',
    eventMissingItems: 'Fehlende Artikel',
    missing: 'Fehlen',
    outOf: 'von',
  },
};
i18n.fallbacks = true;
i18n.locale = Localization.locale;

const App = () => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    'Avenir-Black': require('./assets/fonts/Avenir-Black.otf'),
    'Avenir-Book': require('./assets/fonts/Avenir-Book.otf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();

    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    console.log('Checking for updates...');

    if (__DEV__) {
      return;
    }

    try {
      const update = await checkForUpdateAsync();
      if (update.isAvailable) {
        await fetchUpdateAsync();
        Alert.alert(
          'App successfully updated',
          'The app has been updated to the latest version. The app will now restart.',
          [{ text: 'OK', onPress: async () => reloadAsync() }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while checking for updates.');
    }
  };
  Updates.addListener(checkForUpdates);

  useEffect(() => {
    const loadAsync = async () => {
      if (fontsLoaded) {
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
      }
    };
    loadAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
