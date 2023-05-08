import React from 'react';
import { Button, GestureResponderEvent } from 'react-native';
import colors from '../../constants/colors';

export default function NativeButton({
  onPress,
  type = 'primary',
  title,
  disabled,
}: {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  return (
    <Button
      title={title}
      color={type === 'secondary' ? colors.accent : colors.primary}
      onPress={onPress}
      disabled={disabled}
    />
  );
}
