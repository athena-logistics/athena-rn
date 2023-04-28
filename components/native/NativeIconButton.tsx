import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../constants/colors';

const NativeButtonIcon = ({
  onPress,
  name,
  size,
}: {
  onPress: (event: GestureResponderEvent) => void;
  name: React.ComponentProps<typeof Ionicons>['name'];
  size: number;
}) => {
  const ButtonComponent: React.ComponentClass =
    Platform.OS === 'android' && Platform.Version >= 21
      ? TouchableNativeFeedback
      : TouchableOpacity;

  return (
    <View style={styles.buttonContainer}>
      <ButtonComponent>
        <Ionicons
          size={size}
          name={name}
          onPress={onPress}
          color={colors.primary}
        />
      </ButtonComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {},

  buttonContainer: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  androidButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'white',
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
  },
});

export default NativeButtonIcon;
