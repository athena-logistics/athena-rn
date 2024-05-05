import { Ionicons } from '@expo/vector-icons';

export const getTabBarIcon =
  ({ name }: { name: React.ComponentProps<typeof Ionicons>['name'] }) =>
  // eslint-disable-next-line react/display-name
  ({ color }: { color: string }) => (
    <Ionicons name={name} size={23} color={color} />
  );
