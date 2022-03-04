import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import Modal from 'react-native-modal';

const NativeModal = ({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!show) {
      Keyboard.dismiss();
    }
  }, [show]);

  return (
    <Modal
      isVisible={show}
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      backdropOpacity={0.95}
      backdropColor={'white'}
      backdropTransitionOutTiming={0}
    >
      {children}
    </Modal>
  );
};

export default NativeModal;
