import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { LogisticEventConfigurationFragment } from '../apollo/schema';
import OverviewItemRow from '../components/OverviewItemRow';
import NativeScreen from '../components/native/NativeScreen';
import { getNodes } from '../helpers/apollo';

export default function ItemOverview({
  event,
  refetch,
  stateReloading,
}: {
  event: LogisticEventConfigurationFragment;
  refetch: () => void;
  stateReloading: boolean;
}) {
  const itemGroups = getNodes(event.itemGroups);

  return (
    <NativeScreen style={styles.screen}>
      <FlatList
        data={itemGroups}
        onRefresh={refetch}
        refreshing={stateReloading}
        renderItem={({ item }) => {
          return (
            <OverviewItemRow itemGroup={item} event={event} key={item.id} />
          );
        }}
        keyExtractor={(row) => row.id}
      />
    </NativeScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    // alignItems: 'center',
    flex: 1,
    marginVertical: 10,
  },
});
