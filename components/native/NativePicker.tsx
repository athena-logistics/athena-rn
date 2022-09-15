import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import NativeText from './NativeText';

interface NativePickerProps {
  selectedValue: any;
  setSelectedValue?: (value: string) => void;
  items: any;
  placeholderText?: string;
  width?: string;
  alreadySelectedItems?: string[];
  disabled?: boolean;
  itemById?: { [key: string]: StockItem | Location };
}

const NativePicker: FC<NativePickerProps> = ({
  selectedValue,
  setSelectedValue,
  items,
  placeholderText,
  width,
  disabled,
  itemById,
  alreadySelectedItems,
}) => {
  const [currentlySeletectedItem, setCurrentlySeletectedItem] = useState<any>();
  useEffect(() => {
    if (itemById || !selectedValue) {
      setCurrentlySeletectedItem(itemById?.[selectedValue] || selectedValue);
    }
  }, [selectedValue]);
  return (
    <View style={[styles.picker, width ? { width } : {}]}>
      <SectionedMultiSelect
        items={items
          .map((item: any) => ({
            ...item,
            children: item.children.filter(
              (child: any) => !alreadySelectedItems?.includes(child.id)
            ),
          }))
          .filter((item: any) => item.children.length > 0)}
        IconRenderer={MaterialIcons}
        uniqueKey="id"
        subKey="children"
        selectText={placeholderText || 'Select...'}
        showDropDowns={true}
        single={true}
        onSelectedItemsChange={([item]) =>
          setSelectedValue && setSelectedValue(item)
        }
        onSelectedItemObjectsChange={([item]) =>
          setCurrentlySeletectedItem(item)
        }
        searchPlaceholderText="Search..."
        confirmText="OK"
        selectedItems={[selectedValue]}
        alwaysShowSelectText={true}
        selectedText={'kkk'}
        dropDownToggleIconUpComponent={() => (
          <Ionicons name={'ios-chevron-up'} color={colors.primary} size={22} />
        )}
        dropDownToggleIconDownComponent={() => (
          <Ionicons
            name={'ios-chevron-down'}
            color={colors.primary}
            size={22}
          />
        )}
        disabled={disabled}
        modalWithSafeAreaView={true}
        modalWithTouchable={true}
        renderSelectText={({ selectText }) => {
          return (
            <NativeText style={styles.selectText}>
              {currentlySeletectedItem?.name || selectText}
            </NativeText>
          );
        }}
        // subItemsFlatListProps={{
        //   renderItem: ({ item }) => (
        //     <Pressable onPress={() => setSelectedValue(item)}>
        //       <NativeText>{item.stock}</NativeText>
        //     </Pressable>
        //   ),
        // }}
        selectedIconOnLeft={true}
        selectedIconComponent={() => (
          <Ionicons
            name={'ios-heart-dislike-circle'}
            color={colors.primary}
            size={22}
          />
        )}
        expandDropDowns={true}
        readOnlyHeadings={true}
        showCancelButton={true}
        selectToggleIconComponent={() => (
          <Ionicons
            name={'ios-chevron-down'}
            color={colors.primary}
            size={22}
          />
        )}
        styles={{
          button: {
            backgroundColor: colors.primary,
          },
          selectToggle: {
            borderColor: colors.primary,
            borderStyle: 'dotted',
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            shadowColor: colors.accent,
            width: '100%',
          },
          chipText: { color: colors.pink },
          itemText: {
            color: colors.pink,
          },
          subItemText: {
            color: colors.primary,
            paddingLeft: 10,
            fontSize: 22,
          },
          selectedSubItemText: { color: colors.black },
          selectToggleText: {
            // fontSize: 22,
            color: colors.primary,
            fontFamily: fonts.defaultFontFamily,
          },
          modalWrapper: {
            paddingHorizontal: 0,
            paddingVertical: 60,
          },
        }}
      />
      {/* <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        value={'hockey'}
        style={{
          viewContainer: { backgroundColor: 'white', shadowColor: 'blue' },
          inputAndroid: {
            color: 'red',
          },
          inputIOS: {
            color: 'red',
          },
          modalViewBottom: {
            backgroundColor: 'white',
          },
        }}
        items={[
          { label: 'Football', value: 'football' },
          { label: 'Baseball', value: 'baseball' },
          { label: 'Hockey', value: 'hockey' },
        ]}
        placeholder={'select'}
        useNativeAndroidPickerStyle={false}
        pickerProps={{
          dropdownIconColor: 'red',
          mode: 'dialog',
        }}
        doneText="ok"
      /> */}
      {/* <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setSelectedValue(itemValue);
        }}
        style={{
          height: 50,
          width: 150,
          color: 'black',
          backgroundColor: 'pink',
        }}
        dropdownIconColor={'red'}
      >
        {items.map((item) => (
          <Picker.Item label={item.label} value={item.value} key={item.value} />
        ))}
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker> */}
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    // color: 'red',
    // alignContent: 'stretch',
    // alignItems: 'stretch',
  },
  selectText: {
    flex: 1,
  },
});
export default NativePicker;
