import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { FlatList, SectionList, StyleSheet, Switch, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput } from '../apollo/schema';
import NativeText from '../components/native/NativeText';
import StockItemRow from '../components/StockItemRow';
import colors from '../constants/colors';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';

const StockByItem = ({
  itemList,
  fetch,
  loading,
}: {
  itemList: StockItem[];
  fetch: () => void;
  loading: boolean;
}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const [isEditing, setIsEditing] = useState(true);
  const [isGroupView, setIsGroupView] = useState(true);
  const toggleGroupView = () =>
    setIsGroupView((previousState) => !previousState);
  const toggleEditing = () => setIsEditing((previousState) => !previousState);

  const [createConsumeMutation] = useMutation<ConsumeInput>(DO_CONSUME, {
    onError: (error) => console.log('error', error),
    onCompleted: (data) => {
      // @ts-ignore
      console.log('completed messages:', data.consume.messages);
      // @ts-ignore
      if (data.consume.messages.length > 0) {
        // @ts-ignore
        data.consume.messages.forEach((message) => {
          if (message.__typename === 'ValidationMessage') {
            console.log('error', message.field + ' ' + message.message);
            Toast.show({
              type: 'error',
              text1: 'error',
              text2: message.field + ' ' + message.message,
            });
          }
        });
        fetch();
      }
    },
  });

  const renderRow = ({ item }: { item: StockItem }) => {
    return (
      <StockItemRow
        row={item}
        key={item.id + item.locationId}
        isEditing={isEditing}
        loading={loading}
        createConsumeMutation={createConsumeMutation}
      />
    );
  };

  return (
    <>
      <View style={style.actions}>
        <Switch onChange={toggleEditing} value={isEditing} />
        <NativeText>Edit</NativeText>
        <Switch onChange={toggleGroupView} value={isGroupView} />
        <NativeText>Group view</NativeText>
      </View>
      {!isGroupView && (
        <FlatList
          data={itemList}
          onRefresh={fetch}
          refreshing={loading}
          renderItem={renderRow}
          keyExtractor={(row) => row.id + row.locationId}
        />
      )}
      {isGroupView && (
        <SectionList
          sections={getGroupedData(itemList).map((x) => ({
            id: x.id,
            name: x.name,
            data: x.children,
          }))}
          refreshing={loading}
          onRefresh={fetch}
          // @ts-ignore
          keyExtractor={(item) => item.id + item.stock + item.locationId}
          renderItem={({ item }) => (
            <StockItemRow
              row={item}
              isEditing={isEditing}
              loading={loading}
              createConsumeMutation={createConsumeMutation}
            />
          )}
          renderSectionHeader={({ section: { name, id } }) => (
            <View style={style.row} key={id}>
              <NativeText>{name}</NativeText>
            </View>
          )}
        />
      )}
    </>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      paddingVertical: 10,
      width: '100%',
      overflow: 'hidden',
    },
    actions: {
      alignContent: 'flex-end',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      width: '100%',
    },
  });

export default StockByItem;
