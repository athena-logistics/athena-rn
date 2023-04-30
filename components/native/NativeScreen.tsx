import { FC, ReactNode } from 'react';
import {
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../constants/colors';
import isAndroid from '../../constants/isAndroid';

interface NativeScreenProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const NativeScreen: FC<NativeScreenProps> = ({ children, style }) => {
  return (
    <View style={[styles.screen, style]}>
      <StatusBar
        backgroundColor={isAndroid ? colors.primary : 'white'}
        barStyle={isAndroid ? 'light-content' : 'dark-content'}
      />
      {children}
    </View>
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
