import { SafeAreaView, StyleSheet } from 'react-native';
import NativeButton from './native/NativeButton';
import { FormattedMessage, useIntl } from 'react-intl';
import IonIcon from './native/IonIcon';
import colors from '../constants/colors';
import NativeText from './native/NativeText';

export default function Crash({ retry }: { retry: () => void }): JSX.Element {
  const intl = useIntl();
  return (
    <SafeAreaView style={styles.container}>
      <IonIcon name="warning" color={colors.orange} size={150} />
      <NativeText style={styles.title}>
        <FormattedMessage id="error.unknown.title" defaultMessage="Oh No!" />
      </NativeText>
      <NativeText>
        <FormattedMessage
          id="error.unknown.description"
          defaultMessage="Something went wrong."
        />
      </NativeText>
      <NativeButton
        title={intl.formatMessage({ id: 'retry', defaultMessage: 'Retry' })}
        onPress={retry}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 30,
  },
});
