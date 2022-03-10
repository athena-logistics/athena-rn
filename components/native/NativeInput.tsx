import { FC } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import fonts from '../../constants/fonts';

interface NativeInput extends TextInputProps {}

const NativeInput: FC<NativeInput> = ({ style, ...rest }) => {
  return <TextInput {...rest} style={[styles.input, style]} />;
};

const styles = StyleSheet.create({
  input: {
    fontFamily: fonts.defaultFontFamily,
  },
});

export default NativeInput;
