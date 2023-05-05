import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { LogisticEventConfigurationFragment } from '../apollo/schema';
import OverviewLocationRow from '../components/LocationRow';
import NativeScreen from '../components/native/NativeScreen';
import { getNodes } from '../helpers/apollo';

export default function LocationOverview({
  event,
  refetch,
  stateReloading,
}: {
  event: LogisticEventConfigurationFragment;
  refetch: () => void;
  stateReloading: boolean;
}) {
  const locations = getNodes(event.locations);

  return (
    <NativeScreen style={styles.screen}>
      <FlatList
        data={locations}
        onRefresh={refetch}
        refreshing={stateReloading}
        renderItem={({ item: location }) => {
          return (
            <OverviewLocationRow
              event={event}
              location={location}
              key={location.id}
            />
          );
        }}
        keyExtractor={(row) => row.id}
      />
    </NativeScreen>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'stretch' },
});
