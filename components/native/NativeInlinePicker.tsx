import { Picker } from '@react-native-picker/picker';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';

interface BaseItem {
  id: string;
  name: string;
}

interface NativeInlinePickerProps<Item> {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  items: Item[];
  width?: string;
}

const NativeInlinePicker: FC<NativeInlinePickerProps<BaseItem>> = <
  Item extends BaseItem
>({
  selectedValue,
  setSelectedValue,
  items,
  width,
}: NativeInlinePickerProps<Item>) => {
  return (
    <View style={[styles.picker, width ? { width } : {}]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setSelectedValue(itemValue);
        }}
        style={{
          width: '100%',
          color: colors.secondary,
          overflow: 'hidden',
        }}
        dropdownIconColor={colors.red}
      >
        {items.map((item) => (
          <Picker.Item label={item.name} value={item.id} key={item.id} />
        ))}
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: '40%',
    color: colors.red,
    alignContent: 'stretch',
    alignItems: 'stretch',
  },
});
export default NativeInlinePicker;
