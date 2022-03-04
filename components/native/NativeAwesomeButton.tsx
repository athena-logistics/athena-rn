import { StyleSheet } from 'react-native';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/cartman';
import colors from '../../constants/colors';

const NativeAwesomeButton = ({
  title,
  onPress,
  type = 'primary',
  style,
}: {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  style?: Object;
}) => {
  return (
    <AwesomeButtonRick
      type={type}
      onPress={onPress}
      size={'small'}
      style={[
        styles.androidButton,
        style,
        // type === 'primary' ? styles.primaryButton : styles.secondaryButton,
      ]}
    >
      {title}
    </AwesomeButtonRick>
  );
};

const styles = StyleSheet.create({
  androidButton: {},
  primaryButton: {
    backgroundColor: colors.primaryButtonBackground,
  },
  secondaryButton: {
    backgroundColor: colors.secondaryButtonBackground,
  },
  primaryText: {
    color: colors.primaryButtonText,
  },
  secondaryText: {
    color: colors.secondaryButtonText,
  },
});

export default NativeAwesomeButton;
