import { FC, ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

interface NativeBodyTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

const NativeBodyText: FC<NativeBodyTextProps> = ({ style, children }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.defaultFontFamily,
    fontSize: 16,
    color: colors.secondary,
  },
});

export default NativeBodyText;
