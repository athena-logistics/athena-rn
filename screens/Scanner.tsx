import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import NativeButton from '../components/native/NativeButton';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import { API_URL } from '../constants/app';
import colors from '../constants/colors';
import isAndroid from '../constants/isAndroid';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import {
  resetPermissions,
  switchToEvent,
  switchToLocation,
} from '../store/actions/global.actions';

const Scanner = ({}: {}) => {
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [scanned, setScanned] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  useEffect(() => {
    const load = async () => {
      if (!hasPermission) {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    };
    load();
  }, []);

  const openInfo = () => {
    setInfoOpened(true);
  };

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerRight: () => (
        <Pressable onPress={openInfo}>
          <Ionicons
            name="information-circle-outline"
            color={isAndroid ? colors.white : colors.primary}
            size={33}
            style={{ marginRight: 10 }}
          />
        </Pressable>
      ),
    });
  }, [navigation, openInfo]);

  const handleBarCodeScanned: BarCodeScannedCallback = async ({
    type,
    data,
  }) => {
    setScanned(true);

    const locationRegexp = new RegExp(
      `^${API_URL}/vendor/locations/((\\d|[a-z]|-)+)$`
    );
    const locationMatches = data.match(locationRegexp);
    if (locationMatches) {
      const locationId = locationMatches[1];
      await dispatch(resetPermissions());
      return await dispatch(switchToLocation(locationId));
    }

    const overviewRegexp = new RegExp(
      `^${API_URL}/logistics/events/((\\d|[a-z]|-)+)/overview$`
    );
    const matches = data.match(overviewRegexp);
    if (matches) {
      const eventId = matches[1];
      await dispatch(resetPermissions());
      return await dispatch(switchToEvent(eventId));
    }

    alert('no luck');
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <NativeScreen>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && (
        <NativeButton
          title={'Tap to Scan Again'}
          onPress={() => setScanned(false)}
        />
      )}
      {infoOpened && (
        <Modal
          animationType={'slide'}
          onRequestClose={() => {
            setInfoOpened(false);
          }}
          transparent={true}
        >
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.body}>
                <NativeText>INFO</NativeText>
                <NativeText>Privacy policy</NativeText>
              </View>
              <NativeButton
                onPress={() => setInfoOpened(false)}
                title={'Close'}
              />
            </View>
          </View>
        </Modal>
      )}
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {},
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      width: '80%',
      height: '80%',
      margin: 20,
      backgroundColor: 'white',
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    body: {
      flex: 1,
    },
  });

export default Scanner;
