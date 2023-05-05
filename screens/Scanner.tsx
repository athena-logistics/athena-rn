import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RootParamsList } from '../components/AuthorizationNavigation';
import NativeButton from '../components/native/NativeButton';
import NativeScreen from '../components/native/NativeScreen';

const EXTRACT_LOGISTICS_EXPRESSION = new RegExp(
  `^https://(.+)/logistics/events/((\\d|[a-z]|-)+)/overview$`
);
const EXTRACT_VENDOR_EXPRESSION = new RegExp(
  `^https://(.+)/vendor/locations/((\\d|[a-z]|-)+)$`
);

function extractLogisticsAccess(
  data: string
): false | { apiHost: string; eventId: string } {
  const matches = data.match(EXTRACT_LOGISTICS_EXPRESSION);
  if (!matches) return false;

  const apiHost = matches[1];
  const eventId = matches[2];

  return { apiHost, eventId };
}

function extractVendorAccess(
  data: string
): false | { apiHost: string; locationId: string } {
  const matches = data.match(EXTRACT_VENDOR_EXPRESSION);
  if (!matches) return false;

  const apiHost = matches[1];
  const locationId = matches[2];

  return { apiHost, locationId };
}

export default function Scanner() {
  const navigation = useNavigation<NavigationProp<RootParamsList>>();

  const [hasPermission, setHasPermission] = useState<boolean>();
  const [scanned, setScanned] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (hasPermission) return;

      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    }
    load();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type,
    data,
  }) => {
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

  if (hasPermission === undefined) {
    return (
      <NativeScreen>
        <Text>Requesting for camera permission</Text>
      </NativeScreen>
    );
  }
  if (hasPermission === false) {
    return (
      <NativeScreen>
        <Text>No access to camera</Text>
      </NativeScreen>
    );
  }

  return (
    <NativeScreen>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
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
