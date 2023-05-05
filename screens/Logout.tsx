import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { RootParamsList } from '../components/AuthorizationNavigation';
import colors from '../constants/colors';

export default function Logout({
  navigation,
}: {
  navigation: NavigationProp<RootParamsList>;
}) {
  useFocusEffect(() => {
    navigation.navigate('guest');
  });

  return <ActivityIndicator size={'large'} color={colors.primary} />;
}
