import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export interface NativePickerProps
  extends Omit<
    React.ComponentProps<typeof SectionedMultiSelect>,
    | 'IconRenderer'
    | 'dropDownToggleIconUpComponent'
    | 'dropDownToggleIconDownComponent'
    | 'modalWithSafeAreaView'
    | 'modalWithTouchable'
    | 'selectedIconOnLeft'
    | 'selectedIconComponent'
    | 'expandDropDowns'
    | 'showCancelButton'
    | 'selectToggleIconComponent'
    | 'styles'
  > {
  placeholder?: string;
}

export default function NativePicker({
  placeholder,
  ...props
}: NativePickerProps) {
  return (
    <SectionedMultiSelect
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      IconRenderer={MaterialIcons as any}
      selectText={props.selectText ?? placeholder ?? 'Select...'}
      showDropDowns={props.showDropDowns ?? true}
      searchPlaceholderText={props.searchPlaceholderText ?? 'Search...'}
      confirmText={props.confirmText ?? 'OK'}
      alwaysShowSelectText={props.alwaysShowSelectText ?? true}
      dropDownToggleIconUpComponent={
        <Ionicons name="chevron-up" color={colors.primary} size={22} />
      }
      dropDownToggleIconDownComponent={
        <Ionicons name={'chevron-down'} color={colors.primary} size={22} />
      }
      modalWithSafeAreaView={true}
      modalWithTouchable={true}
      selectedIconOnLeft={true}
      selectedIconComponent={
        <Ionicons
          name={'heart-dislike-circle'}
          color={colors.primary}
          size={22}
        />
      }
      expandDropDowns={true}
      showCancelButton={true}
      selectToggleIconComponent={
        <Ionicons name={'chevron-down'} color={colors.primary} size={22} />
      }
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
          color: colors.primary,
          fontFamily: fonts.defaultFontFamily,
        },
        modalWrapper: {
          paddingHorizontal: 0,
          paddingVertical: 60,
        },
      }}
    />
  );
}
