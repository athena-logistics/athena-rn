import { useNavigation } from '@react-navigation/native';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import NativeButton from '../components/native/NativeButton';
import NativeScreen from '../components/native/NativeScreen';
import { API_URL } from '../constants/app';
import { Orientation } from '../hooks/useOrientation';
import { setEventId } from '../store/actions/global.actions';

const Scanner = ({}: {}) => {
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  const navigation = useNavigation();
  const handleBarCodeScanned: BarCodeScannedCallback = ({ type, data }) => {
    setScanned(true);
    const overviewRegexp = new RegExp(
      `^${API_URL}/logistics/events/((\\d|[a-z]|-)+)/overview$`
    );
    const matches = data.match(overviewRegexp);
    if (matches) {
      dispatch(setEventId(matches[1]));
      // @ts-ignore
      navigation.navigate('Overview Stack', { eventId: matches[1] });
      alert('got it');
    } else {
      alert('no luck');
    }
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
    </NativeScreen>
  );
};

const style = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {},
  });

export default Scanner;
