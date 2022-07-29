import { FC, ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

interface NativeScreenProps {
  children?: ReactNode;
  style?: Object;
}

const NativeScreen: FC<NativeScreenProps> = ({ children, style }) => {
  return (
      <SafeAreaView style={{ ...styles.screen, ...style }}>{children}</SafeAreaView>
  );
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
