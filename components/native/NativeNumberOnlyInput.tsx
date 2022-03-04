import { FC } from 'react';
import { TextInputProps } from 'react-native';
import NativeInput from './NativeInput';

interface NativeNumberOnlyInputProps extends TextInputProps {}

const NativeNumberOnlyInput: FC<NativeNumberOnlyInputProps> = ({
  onChangeText,
  ...rest
}) => {
  const handleChangeText = (text: string) => {
    if (!text.match(/[^\d]/g) && text !== '') {
      onChangeText && onChangeText(text);
    }
  };
  return (
    <NativeInput
      keyboardType={'number-pad'}
      maxLength={2}
      {...rest}
      onChangeText={handleChangeText}
    />
  );
};

export default NativeNumberOnlyInput;
