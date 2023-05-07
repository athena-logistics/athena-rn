import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from 'expo-updates';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  GITHUB_URL,
  MAENNCHEN_URL,
  PRIVACY_POLICY_URL,
  PUNKAH_URL,
  TERMS_AND_CONDITIONS_URL,
} from '../constants/app';
import colors from '../constants/colors';
import NativeButton from './native/NativeButton';
import NativeText from './native/NativeText';

export default function AppInfo() {
  const intl = useIntl();

  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsUpdating(true);
      const update = await checkForUpdateAsync();

      if (update.isAvailable) {
        await fetchUpdateAsync();

        Alert.alert(
          intl.formatMessage({
            id: 'app.updated.title',
            defaultMessage: 'App has been successfully updated',
          }),
          intl.formatMessage({
            id: 'app.updated.description',
            defaultMessage:
              'The app has been updated to the latest version. The app will now restart.',
          }),
          [
            {
              text: intl.formatMessage({
                id: 'ok',
                defaultMessage: 'OK',
              }),
              onPress: async () => reloadAsync(),
            },
          ]
        );
      } else {
        Toast.show({
          text1: intl.formatMessage({
            id: 'app.uptodate.title',
            defaultMessage: 'Up to date',
          }),
          text2: intl.formatMessage({
            id: 'app.uptodate.description',
            defaultMessage: 'You already have the latest version of the app.',
          }),
        });
      }
    } catch (error) {
      console.error(error);

      Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'app.update.error.title',
          defaultMessage: 'Update Error',
        }),
        text2: intl.formatMessage({
          id: 'app.update.error.description',
          defaultMessage: 'An error occurred while checking for updates.',
        }),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.body}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
            <Image style={styles.logo} source={require('../assets/logo.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <NativeText style={styles.title} type="bold">
            Athena Event Logistics
          </NativeText>
          <NativeText>
            Athena was built for logistics management of the Aufgetischt and
            Buskers Chur Festivals by @punkah and @maennchen.
          </NativeText>
          <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
            <NativeText style={styles.link}>Athena GitHub page</NativeText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(PUNKAH_URL)}>
            <NativeText style={styles.link}>@punkah</NativeText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(MAENNCHEN_URL)}>
            <NativeText style={styles.link}>@maennchen</NativeText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <NativeText style={styles.link}>Privacy policy</NativeText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}
          >
            <NativeText style={styles.link}>Terms & Conditions</NativeText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        {isUpdating ? (
          <ActivityIndicator size={'small'} color={colors.primary} />
        ) : (
          <NativeButton onPress={checkForUpdates} title="Check for updates" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flex: 1, flexWrap: 'wrap', gap: 10 },
  title: { fontSize: 22 },
  container: {
    padding: 10,
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  link: {
    color: 'blue',
    textDecorationColor: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  logo: {
    width: 104,
    height: 120,
    marginRight: 20,
    marginBottom: 20,
  },
  buttons: {
    width: '100%',
    paddingBottom: 20,
  },
});
