import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Image, StyleSheet, View } from 'react-native';
import NativeText from './native/NativeText';
import fonts from '../constants/fonts';
import Logo from '../assets/logo.png';
import { JSX } from 'react';

export default function BrandedDrawerContent(
  props: DrawerContentComponentProps & { children?: JSX.Element },
) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Image style={styles.logo} source={Logo} />
        {props.children}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export function BrandedDrawerWithTitle({
  title,
  ...rest
}: React.ComponentProps<typeof BrandedDrawerContent> & { title: string }) {
  return (
    <BrandedDrawerContent {...rest}>
      <NativeText style={styles.title}>{title}</NativeText>
    </BrandedDrawerContent>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
    gap: 20,
  },
  logo: {
    width: 156,
    height: 180,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.defaultFontFamilyBold,
  },
});
