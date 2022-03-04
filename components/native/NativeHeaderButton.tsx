import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import colors from '../../constants/colors';
import isAndroid from '../../constants/isAndroid';

const NativeHeaderButton = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<HeaderButton> &
    Readonly<HeaderButtonProps> &
    Readonly<{ children?: React.ReactNode }>
) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={isAndroid ? 'white' : colors.primary}
    />
  );
};

export default NativeHeaderButton;
