import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';
import { StyleSheet } from 'react-native';

interface IonIconProps {
  name: any;
  size?: number;
  color: string;
}

const IonIcon: FC<IonIconProps> = ({ name, size, color }) => {
  return <Ionicons name={name} size={size} color={color} />;
};

const styles = StyleSheet.create({});

export default IonIcon;
