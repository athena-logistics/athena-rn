import { FC, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

interface NativeTitleProps {
  children: ReactNode;
  style?: Object;
}

const NativeTitleText: FC<NativeTitleProps> = ({ style, children }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 22,
    color: colors.secondary,
  },
});
export default NativeTitleText;
