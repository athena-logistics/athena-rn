import {
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import 'expo-asset';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from 'expo-updates';
import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import AuthorizationNavigation from './components/AuthorizationNavigation';
import { locale, getLocales } from 'expo-localization';
import { IntlProvider } from 'react-intl';
import en from './compiled-lang/en.json';
import de from './compiled-lang/de.json';

if (__DEV__) {
  LogBox.ignoreLogs(['Overwriting fontFamily style attribute preprocessor']);
}

const allTranslations: Record<string, unknown> = { en, de };

const matchedLanguageTag: keyof typeof allTranslations | undefined =
  getLocales()
    .map((locale) => locale.languageTag)
    .find((tag) => tag in allTranslations);
const matchedLanguageCode: keyof typeof allTranslations | undefined =
  getLocales()
    .map((locale) => locale.languageCode)
    .find((code) => code in allTranslations);
const messages =
  allTranslations[matchedLanguageTag ?? matchedLanguageCode ?? 'en'];

export default function App() {
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

    setInterval(checkForUpdates, 1000 * 60 * 60);
  }, []);

  const checkForUpdates = async () => {
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
      console.error(error);
    }
  };

  useEffect(() => {
    const loadAsync = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    loadAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <IntlProvider
        locale={locale}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages={messages as any}
      >
        <AuthorizationNavigation />
        <Toast />
      </IntlProvider>
    </>
  );
}
