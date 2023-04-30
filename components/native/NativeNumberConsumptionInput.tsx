import { Ionicons } from '@expo/vector-icons';
import i18n from '../../helpers/i18n';
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

interface NativeNumberConsumptionInputProps extends TextInputProps {
  onChangeText: (newValue?: string, change?: number) => void;
  loading: boolean;
  max?: number;
}

const NativeNumberConsumptionInput: FC<NativeNumberConsumptionInputProps> = ({
  onChangeText,
  value,
  editable,
  loading,
  max,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (!loading) {
      if (value !== currentValue) {
        setCurrentValue(value?.toString());
      }
    }
  }, [value, loading]);

  const add = (up: boolean) => () => {
    const change = up ? 1 : -1;
    setCurrentValue((currentValue) => Number(currentValue) + change + '');
    onChangeText(undefined, change);
  };

  const handleBlur = () => {
    onChangeText && onChangeText(currentValue);
  };

  return (
    <View style={styles.numberContainer}>
      <TouchableOpacity onPress={add(false)} disabled={!editable}>
        {editable && (
          <Ionicons
            size={35}
            name={'ios-remove-circle'}
            color={colors.primary}
          />
        )}
      </TouchableOpacity>
      <View style={styles.numberColumn}>
        <View style={styles.numbers}>
          <NativeInput
            style={styles.number}
            keyboardType="number-pad"
            {...rest}
            value={currentValue}
            onChangeText={setCurrentValue}
            onBlur={handleBlur}
          />
          {max != currentValue && <NativeText>/{max}</NativeText>}
        </View>
        <NativeText style={styles.numberText}>{i18n.t('inStock')}</NativeText>
      </View>
      <TouchableOpacity onPress={add(true)} disabled={!editable}>
        {editable && (
          <Ionicons size={35} name={'ios-add-circle'} color={colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  numberColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  numbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  number: {
    fontSize: 22,
    fontFamily: fonts.defaultFontFamilyBold,
    color: colors.primary,
  },
  input: {
    alignItems: 'center',
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 26,
    color: colors.primary,
    paddingHorizontal: 5,
  },
  red: {
    color: colors.red,
  },
  yellow: {
    color: colors.orange,
  },
  green: {
    color: colors.green,
  },
});

export default NativeNumberConsumptionInput;
