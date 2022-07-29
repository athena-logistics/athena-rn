import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { StockEntryStatus } from '../../apollo/schema';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import NativeInput from './NativeInput';
import NativeText from './NativeText';

interface NativeNumberConsumptionInputProps extends TextInputProps {
  onChangeText: (newValue?: string, change?: number) => void;
  loading: boolean;
  type: StockEntryStatus;
}

const NativeNumberConsumptionInput: FC<NativeNumberConsumptionInputProps> = ({
  onChangeText,
  value,
  editable,
  loading,
  type,
  ...rest
}) => {
  const isPressing = useRef(false);
  const timer = useRef<any>();
  const timer2 = useRef<any>();

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (!loading) {
      if (value !== currentValue) {
        console.log('setting current value', value, currentValue);
        setCurrentValue(value?.toString());
      }
    }
  }, [value, loading]);

  const add = (up: boolean) => () => {
    const change = up ? 1 : -1;
    if (Number(currentValue) >= 0) {
      setCurrentValue((currentValue) => Number(currentValue) + change + '');
      if (!isPressing.current) {
        onChangeText(undefined, change);
      }
    }
  };

  const cancelLongPress = async () => {
    if (isPressing.current) {
      clearInterval(timer.current);
      if (Number(currentValue) >= 0) {
        onChangeText(currentValue);
      }
      isPressing.current = false;
    }
  };

  const onLongPress = (onPress: any) => () => {
    isPressing.current = true;
    timer.current = setInterval(onPress, 50);
  };

  const handleBlur = (props: any) => {
    if (Number(currentValue) >= 0) {
      onChangeText && onChangeText(currentValue);
    }
  };

  const color =
    type === StockEntryStatus.Important
      ? styles.red
      : type === StockEntryStatus.Warning
      ? styles.yellow
      : type === StockEntryStatus.Normal
      ? styles.green
      : {};

  return (
    <View style={styles.numberContainer}>
      <TouchableOpacity
        onPress={add(true)}
        onLongPress={onLongPress(add(true))}
        onPressOut={cancelLongPress}
        disabled={!editable}
      >
        {editable && (
          <Ionicons size={35} name={'ios-add-circle'} color={colors.primary} />
        )}
      </TouchableOpacity>
      <View style={styles.numberColumn}>
        <NativeInput
          style={styles.number}
          keyboardType="number-pad"
          {...rest}
          value={currentValue}
          onChangeText={setCurrentValue}
          onBlur={handleBlur}
        />
        <NativeText style={styles.numberText}>in stock</NativeText>
      </View>
      <TouchableOpacity
        onPress={add(false)}
        onLongPress={onLongPress(add(false))}
        onPressOut={cancelLongPress}
        disabled={!editable}
      >
        {editable && (
          <Ionicons
            size={35}
            name={'ios-remove-circle'}
            color={colors.primary}
          />
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
