import React from 'react';
import { Button } from 'react-native';
import { GestureResponderEvent } from 'react-native-modal';
import colors from '../../constants/colors';

const NativeButton = ({
  onPress,
  type = 'primary',
  title,
  disabled,
}: {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}) => {
  return (
    <Button
      title={title}
      color={type === 'secondary' ? colors.accent : colors.primary}
      onPress={onPress}
      disabled={disabled}
    />
  );
};

export default NativeButton;
