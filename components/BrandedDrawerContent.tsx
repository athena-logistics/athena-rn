import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Image, StyleSheet } from 'react-native';

export default function BrandedDrawerContent(
  props: DrawerContentComponentProps
) {
  return (
    <>
      <Image style={styles.logo} source={require('../assets/logo.png')} />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 156,
    height: 180,
    margin: 20,
  },
});
