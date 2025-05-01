import { Ionicons } from '@expo/vector-icons';

export const getTabBarIcon =
  ({ name }: { name: React.ComponentProps<typeof Ionicons>['name'] }) =>
  ({ color }: { color: string }) => (
    <Ionicons name={name} size={23} color={color} />
  );
