import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';

interface IonIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color: string;
}

const IonIcon: FC<IonIconProps> = ({ name, size, color }) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default IonIcon;
