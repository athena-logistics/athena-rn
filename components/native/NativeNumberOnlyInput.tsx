import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableHighlight } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default function NativeNumberOnlyInput(
  props: Omit<
    React.ComponentProps<typeof TextInput>,
    | 'inputStyle'
    | 'containerStyle'
    | 'type'
    | 'borderColor'
    | 'totalWidth'
    | 'totalHeight'
    | 'customDecIcon'
    | 'customIncIcon'
    | 'leftButtonBackgroundColor'
    | 'rightButtonBackgroundColor'
    | 'onChange'
    | 'value'
  > & {
    onChange: (value: number) => void;
    textColor?: string;
    value: number;
    minValue?: number;
    maxValue?: number;
  },
) {
  const {
    onChange,
    textColor: propTextColor,
    value,
    minValue,
    maxValue,
    ...restProps
  } = props;

  const textColor = propTextColor ?? colors.primary;

  function onTextChanged(strValue: string) {
    if (!onChange) return;
    const numValue = parseInt(strValue.replace(/[^0-9]/g, ''));
    if (minValue !== undefined && numValue <= minValue) return;
    if (maxValue !== undefined && numValue >= maxValue) return;
    onChange(numValue);
  }

  return (
    <>
      <TouchableHighlight
        underlayColor="none"
        onPress={() => {
          props.onChange((props.value || 0) - 1);
        }}
        disabled={(props.value || 0) <= 0}
      >
        <Ionicons size={44} name={'remove-circle'} color={textColor} />
      </TouchableHighlight>
      <TextInput
        placeholder={'0'}
        style={{
          fontFamily: fonts.defaultFontFamilyBold,
          fontSize: 30,
          color: textColor,
          width: 60,
          textAlign: 'center',
        }}
        keyboardType="numeric"
        onChangeText={(value) => onTextChanged(value)}
        value={value.toString()}
        {...restProps}
      />
      <TouchableHighlight
        underlayColor="none"
        onPress={() => {
          props.onChange((props.value || 0) + 1);
        }}
      >
        <Ionicons size={44} name={'add-circle'} color={textColor} />
      </TouchableHighlight>
    </>
  );
}
