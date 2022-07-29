import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import InfoModal from '../components/InfoModal';
import NativeButton from '../components/native/NativeButton';
import NativeScreen from '../components/native/NativeScreen';
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
      `^https://(.+)/vendor/locations/((\\d|[a-z]|-)+)$`
    );
    const locationMatches = data.match(locationRegexp);
    if (locationMatches) {
      const apiHost = locationMatches[1];
      const locationId = locationMatches[2];
      await dispatch(resetPermissions());
      return await dispatch(switchToLocation(locationId, apiHost));
    }

    const overviewRegexp = new RegExp(
      `^https://(.+)/logistics/events/((\\d|[a-z]|-)+)/overview$`
    );
    const matches = data.match(overviewRegexp);
    if (matches) {
      const apiHost = matches[1];
      const eventId = matches[2];
      await dispatch(resetPermissions());
      return await dispatch(switchToEvent(eventId, apiHost));
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
      {!scanned && hasPermission && (
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
      <InfoModal isOpen={infoOpened} onClose={() => setInfoOpened(false)} />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {},
  });

export default Scanner;
