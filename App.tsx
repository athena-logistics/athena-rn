import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import 'expo-asset';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import i18n from 'i18n-js';
import React, { useEffect } from 'react';
import { LogBox, StyleSheet } from 'react-native';
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
  },
  de: {
    supply: 'Anlieferung',
    scanner: 'Scanner',
    move: 'Verschiebung',
    overview: 'Übersicht',
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
  }, []);

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
