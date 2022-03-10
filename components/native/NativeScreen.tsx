import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface NativeScreenProps {
  children?: ReactNode;
  style?: Object;
}

const NativeScreen: FC<NativeScreenProps> = ({ children, style }) => {
  return <View style={{ ...styles.screen, ...style }}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.black,
  },
});

export default NativeScreen;
