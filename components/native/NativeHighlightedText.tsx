import { FC, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

interface NativeHighlightedTextProps {
  children: ReactNode;
  style?: Object;
}

const NativeHighlightedText: FC<NativeHighlightedTextProps> = ({
  style,
  children,
}) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 18,
    color: colors.accent,
  },
});
export default NativeHighlightedText;
