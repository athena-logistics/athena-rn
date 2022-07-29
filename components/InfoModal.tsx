import React from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRIVACY_POLICY_URL } from '../constants/app';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import NativeButton from './native/NativeButton';
import NativeText from './native/NativeText';

const InfoModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  if (!isOpen) {
    return null;
  }

  return (
    <Modal animationType={'slide'} onRequestClose={onClose} transparent={true}>
      <View style={style.centeredView}>
        <View style={style.modalView}>
          <View style={style.body}>
            <NativeText>INFO</NativeText>

            <TouchableOpacity
              onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            >
              <NativeText style={style.link}>Privacy policy</NativeText>
            </TouchableOpacity>
          </View>
          <NativeButton onPress={onClose} title={'Close'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {},
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      width: '80%',
      height: '80%',
      margin: 20,
      backgroundColor: 'white',
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    body: {
      flex: 1,
    },
    link: {
      color: 'blue',
      textDecorationColor: 'blue',
      textDecorationStyle: 'dashed',
      textDecorationLine: 'underline',
    },
  });

export default InfoModal;
