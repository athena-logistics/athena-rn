import React, { useState } from 'react';
import { FlatList, SectionList, StyleSheet, Switch, View } from 'react-native';
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

  const [isEditing, setIsEditing] = useState(false);
  const [isGroupView, setIsGroupView] = useState(false);
  const toggleGroupView = () =>
    setIsGroupView((previousState) => !previousState);
  const toggleEditing = () => setIsEditing((previousState) => !previousState);

  const renderRow = ({ item }: { item: StockItem }) => {
    return <StockItemRow row={item} key={item.id} isEditing={isEditing} />;
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
          keyExtractor={(row) => row.id + row.stock}
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StockItemRow row={item} isEditing={isEditing} />
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
