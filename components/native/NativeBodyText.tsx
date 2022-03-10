import { FC, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

interface NativeBodyTextProps {
  children: ReactNode;
  style?: Object;
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
