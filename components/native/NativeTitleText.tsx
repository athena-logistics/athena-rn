import { FC, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import fonts from '../../constants/fonts';

interface NativeTitleTextProps {
  children: ReactNode;
  style?: Object;
}

const NativeTitleText: FC<NativeTitleTextProps> = ({ style, children }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.defaultFontFamilyBold,
    fontSize: 22,
    color: 'black',
  },
});
export default NativeTitleText;
