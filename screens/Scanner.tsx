import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { RootParamsList } from '../components/AuthorizationNavigation';
import NativeButton from '../components/native/NativeButton';
import NativeScreen from '../components/native/NativeScreen';

const EXTRACT_LOGISTICS_EXPRESSION = new RegExp(
  `^https://(.+)/logistics/events/((\\d|[a-z]|-)+)/overview$`,
);
const EXTRACT_VENDOR_EXPRESSION = new RegExp(
  `^https://(.+)/vendor/locations/((\\d|[a-z]|-)+)$`,
);

function extractLogisticsAccess(
  data: string,
): false | { apiHost: string; eventId: string } {
  const matches = data.match(EXTRACT_LOGISTICS_EXPRESSION);
  if (!matches) return false;

  const apiHost = matches[1];
  const eventId = matches[2];

  return { apiHost, eventId };
}

function extractVendorAccess(
  data: string,
): false | { apiHost: string; locationId: string } {
  const matches = data.match(EXTRACT_VENDOR_EXPRESSION);
  if (!matches) return false;

  const apiHost = matches[1];
  const locationId = matches[2];

  return { apiHost, locationId };
}

export default function Scanner() {
  const navigation = useNavigation<NavigationProp<RootParamsList>>();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (permission?.granted) return;

      await requestPermission();
    }
    load();
  }, []);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    setScanned(true);

    const vendorAccessResult = extractVendorAccess(data);
    if (vendorAccessResult) {
      return navigation.navigate('vendor', {
        locationId: vendorAccessResult.locationId,
        apiHost: vendorAccessResult.apiHost,
      });
    }
    const logisticsAccessResult = extractLogisticsAccess(data);
    if (logisticsAccessResult) {
      return navigation.navigate('logistics', {
        eventId: logisticsAccessResult.eventId,
        apiHost: logisticsAccessResult.apiHost,
      });
    }
  };

  if (!permission) {
    return (
      <NativeScreen>
        <Text>Requesting for camera permission</Text>
      </NativeScreen>
    );
  }
  if (!permission.granted) {
    return (
      <NativeScreen>
        <Text>No access to camera</Text>
      </NativeScreen>
    );
  }

  return (
    <NativeScreen>
      {!scanned && (
        <CameraView
          facing={'back'}
          style={{ flex: 1, width: '100%', height: 10 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarCodeScanned}
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
}
