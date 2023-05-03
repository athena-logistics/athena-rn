import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from 'expo-updates';
import i18n from '../helpers/i18n';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GITHUB_URL,
  MAENNCHEN_URL,
  PRIVACY_POLICY_URL,
  PUNKAH_URL,
  TERMS_AND_CONDITIONS_URL,
} from '../constants/app';
import colors from '../constants/colors';
import isAndroid from '../constants/isAndroid';
import NativeButton from './native/NativeButton';
import NativeText from './native/NativeText';

const InfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  if (!isOpen) {
    return null;
  }

  const checkForUpdates = async () => {
    if (__DEV__) {
      return;
    }

    try {
      setIsUpdating(true);
      const update = await checkForUpdateAsync();
      if (update.isAvailable) {
        await fetchUpdateAsync();
        Alert.alert(
          i18n.t('appUpdated'),
          i18n.t('appUpdatedText'),
          [{ text: 'OK', onPress: async () => reloadAsync() }],
          { cancelable: false }
        );
      } else {
        Alert.alert(i18n.t('upToDate'), i18n.t('upToDateText'));
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', i18n.t('updateErrorText'));
    }
    setIsUpdating(false);
  };

  return (
    <Modal animationType={'slide'} onRequestClose={onClose} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView style={styles.body}>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
                <Image
                  style={styles.logo}
                  source={require('../assets/logo.png')}
                />
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
              <TouchableOpacity
                onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
              >
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
              <ActivityIndicator
                size={'small'}
                color={isAndroid ? colors.white : colors.primary}
                style={{
                  paddingRight: 20,
                }}
              />
            ) : (
              <NativeButton
                onPress={checkForUpdates}
                title="Check for updates"
              />
            )}
            <NativeButton onPress={onClose} title={'Close'} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  row: { flexDirection: 'row', flex: 1, flexWrap: 'wrap' },
  title: { fontSize: 22 },
  modalView: {
    width: '80%',
    height: '80%',
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'flex-start',
    gap: 10,
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
    flexShrink: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
});

export default InfoModal;
