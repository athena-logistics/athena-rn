import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import NativeInput from './NativeInput';
import NativeText from './NativeText';

interface NativeNumberOnlyInputProps extends TextInputProps {
  max?: number;
}

const NativeNumberOnlyInput: FC<NativeNumberOnlyInputProps> = ({
  onChangeText,
  value,
  max,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const add = (offset: number) => () => {
    if (
      (!max || Number(currentValue) + offset <= max) &&
      Number(currentValue) + offset > 0
    ) {
      setCurrentValue((cur) => Number(cur) + offset + '');
    }
  };

  const handleChangeText = (text: string) => {
    if ((!max || Number(text) <= max) && Number(text) > 0) {
      setCurrentValue(text);
    }
  };

  useEffect(() => {
    onChangeText && onChangeText(currentValue!);
  }, [currentValue]);

  return (
    <View style={styles.numberContainer}>
      <TouchableOpacity onPress={add(-1)}>
        <Ionicons size={44} name={'ios-remove-circle'} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.number}>
        <NativeInput
          keyboardType="number-pad"
          {...rest}
          value={currentValue}
          onChangeText={handleChangeText}
          style={styles.input}
        />
        {max !== undefined && <NativeText>/ {max} </NativeText>}
      </View>
      <TouchableOpacity onPress={add(1)}>
        <Ionicons size={44} name={'ios-add-circle'} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    alignItems: 'center',
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 26,
    color: colors.primary,
    paddingHorizontal: 5,
  },
});

export default NativeNumberOnlyInput;
