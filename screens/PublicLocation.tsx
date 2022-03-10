import { StyleSheet, Text } from 'react-native';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';

const PublicLocation = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  return (
    <NativeScreen style={style.screen}>
      <Text>Location public view</Text>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {},
  });

export default PublicLocation;
