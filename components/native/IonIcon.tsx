import { Ionicons } from '@expo/vector-icons';

interface IonIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color: string;
}

export default function IonIcon({ name, size, color }: IonIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
