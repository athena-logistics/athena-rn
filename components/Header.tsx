import { FC, ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import { useOrientation } from '../hooks/useOrientation';
import NativeTitleText from './native/NativeTitleText';

interface HeaderProps {
  children: ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  return (
    <View
      style={{
        ...style.headerBase,
        ...Platform.select({
          ios: style.headerIOS,
          android: style.headerAndroid,
        }),
      }}
    >
      <NativeTitleText style={style.text}>{children}</NativeTitleText>
    </View>
  );
};

const styles = ({
  isPortrait,
  isLandscape,
}: {
  isPortrait: Boolean;
  isLandscape: Boolean;
}) =>
  StyleSheet.create({
    headerBase: {
      width: '100%',
      height: isPortrait ? 90 : 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerIOS: {
      backgroundColor: 'white',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
    },
    headerAndroid: {
      backgroundColor: '#f7287b',
      borderBottomColor: 'white',
      borderBottomWidth: 0,
    },
    text: {
      color: Platform.OS === 'android' ? 'white' : colors.primary,
    },
  });

export default Header;
