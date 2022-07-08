import { Picker } from '@react-native-picker/picker';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';

interface NativeInlinePickerProps {
  selectedValue: any;
  setSelectedValue: (value: string) => void;
  items: any;
  placeholderText?: string;
  width?: string;
}

const NativeInlinePicker: FC<NativeInlinePickerProps> = ({
  selectedValue,
  setSelectedValue,
  items,
  placeholderText,
  width,
}) => {
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
        {items.map((item: any) => (
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
