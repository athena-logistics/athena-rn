import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInputProps, View } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import NativeInput from './NativeInput';
import NativeText from './NativeText';

interface NativeNumberConsumptionInputProps extends TextInputProps {
  onChangeText: (newValue?: string, change?: number) => void;
}

const NativeNumberConsumptionInput: FC<NativeNumberConsumptionInputProps> = ({
  onChangeText,
  value,
  ...rest
}) => {
  const isPressing = useRef(false);
  const timer = useRef<any>();
  const changeTimer = useRef<any>();

  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    console.log('new value', value);
    if (value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  const add = (offset: number) => () => {
    onChangeText(undefined, offset);
    handleChangeText(Number(currentValue) + offset + '');
  };

  const handleChangeText = (text: string) => {
    setCurrentValue(text);
  };

  const cancelLongPress = () => {
    if (isPressing.current) {
      clearInterval(timer.current);
      isPressing.current = false;
    }
  };
  const onLongPress = (onPress: any) => () => {
    isPressing.current = true;
    timer.current = setInterval(onPress, 50);
  };

  return (
    <View style={styles.numberContainer}>
      <View style={styles.numberColumn}>
        <NativeInput
          style={styles.number}
          keyboardType="number-pad"
          {...rest}
          value={currentValue}
        />
        <NativeText style={styles.numberText}>in stock</NativeText>
      </View>
      <Pressable
        onPress={add(-1)}
        onLongPress={onLongPress(add(-1))}
        onPressOut={cancelLongPress}
      >
        <Ionicons size={44} name={'ios-remove-circle'} color={colors.primary} />
      </Pressable>
      {/* <Pressable
        onPress={add(-2)}
        onLongPress={onLongPress(add(-2))}
        onPressOut={cancelLongPress}
      >
        <Ionicons size={44} name={'ios-remove-circle'} color={colors.primary}>
          2
        </Ionicons>
      </Pressable>
      <Pressable
        onPress={add(-5)}
        onLongPress={onLongPress(add(-5))}
        onPressOut={cancelLongPress}
      >
        <Ionicons size={44} name={'ios-remove-circle'} color={colors.primary}>
          5
        </Ionicons>
      </Pressable> */}
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
    fontSize: 20,
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
});

export default NativeNumberConsumptionInput;
