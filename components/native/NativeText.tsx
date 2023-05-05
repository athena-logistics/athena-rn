import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

export default function NativeText({
  type,
  style,
  numberOfLines,
  children,
  ...rest
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  type?: 'bold';
  numberOfLines?: number;
} & React.ComponentProps<typeof Text>) {
  return (
    <Text
      style={[styles.text, style, type === 'bold' ? styles.textBold : null]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.defaultFontFamily,
    fontSize: 16,
    color: colors.primary,
  },
  textBold: {
    fontFamily: fonts.defaultFontFamilyBold,
  },
});
