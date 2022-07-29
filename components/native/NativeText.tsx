import { FC, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

interface NativeTextProps {
  children: ReactNode;
  style?: Object;
  type?: 'bold';
  numberOfLines?: number;
}

const NativeText: FC<NativeTextProps> = ({
  type,
  style,
  numberOfLines,
  children,
}) => {
  return (
    <Text
      style={[styles.text, style, type === 'bold' ? styles.textBold : null]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

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
export default NativeText;
