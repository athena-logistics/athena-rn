import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface NativeCardProps {
  children?: ReactNode;
  style?: Object;
}

const NativeCard: FC<NativeCardProps> = ({ children, style }) => {
  return <View style={{ ...styles.card, ...style }}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 6,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
});

export default NativeCard;
