import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import colors from '../../constants/colors';

const NativeButton = ({
  onPress,
  type = 'primary',
  title,
  style,
  disabled,
}: {
  onPress: (event: any) => void;
  title: string;
  type?: 'primary' | 'secondary';
  style?: Object;
  disabled?: boolean;
}) => {
  const ButtonComponent: React.ComponentClass<any> =
    Platform.OS === 'android' && Platform.Version >= 21
      ? TouchableNativeFeedback
      : TouchableOpacity;

  return (
    <Button
      title={title}
      color={type === 'secondary' ? colors.accent : colors.primary}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

const styles = StyleSheet.create({
  button: {},

  buttonContainer: {
    borderRadius: 2,
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

export default NativeButton;
