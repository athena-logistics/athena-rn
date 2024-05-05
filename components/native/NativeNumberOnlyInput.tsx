import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ViewStyle } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default function NativeNumberOnlyInput(
  props: Omit<
    React.ComponentProps<typeof NumericInput>,
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
  >,
) {
  const textColor = props.textColor ?? colors.primary;
  return (
    <>
      <NumericInput
        textColor={textColor}
        inputStyle={{ fontFamily: fonts.defaultFontFamilyBold } as ViewStyle}
        containerStyle={{ flexShrink: 0, width: 150 }}
        {...props}
        type="plus-minus"
        borderColor="transparent"
        totalWidth={150}
        totalHeight={70}
        customDecIcon={
          <Ionicons size={44} name={'remove-circle'} color={textColor} />
        }
        customIncIcon={
          <Ionicons size={44} name={'add-circle'} color={textColor} />
        }
        leftButtonBackgroundColor={'transparent'}
        rightButtonBackgroundColor={'transparent'}
      />
    </>
  );
}
