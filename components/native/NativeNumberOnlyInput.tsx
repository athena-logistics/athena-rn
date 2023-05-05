import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ViewStyle } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default function NativeNumberOnlyInput(
  props: Omit<
    React.ComponentProps<typeof NumericInput>,
    | 'textColor'
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
  >
) {
  return (
    <>
      <NumericInput
        textColor={colors.primary}
        inputStyle={{ fontFamily: fonts.defaultFontFamilyBold } as ViewStyle}
        containerStyle={{ flexShrink: 0, width: 150 }}
        {...props}
        type="plus-minus"
        borderColor="transparent"
        totalWidth={150}
        totalHeight={70}
        customDecIcon={
          <Ionicons
            size={44}
            name={'ios-remove-circle'}
            color={colors.primary}
          />
        }
        customIncIcon={
          <Ionicons size={44} name={'ios-add-circle'} color={colors.primary} />
        }
        leftButtonBackgroundColor={'transparent'}
        rightButtonBackgroundColor={'transparent'}
      />
    </>
  );
}
