import React from 'react';
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GITHUB_URL,
  MAENNCHEN_URL,
  PRIVACY_POLICY_URL,
  PUNKAH_URL,
  TERMS_AND_CONDITIONS_URL,
} from '../constants/app';
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
            <View style={style.row}>
              <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
                <Image
                  style={style.logo}
                  source={require('../assets/logo.png')}
                />
              </TouchableOpacity>
              <View>
                <NativeText style={style.title} type="bold">
                  Athena Event Logistics
                </NativeText>
                <NativeText>
                  Athena was built for logistics management of the Aufgetischt
                  and Buskers Chur Festivals by @punkah and @maennchen.
                </NativeText>
                <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
                  <NativeText style={style.link}>Athena GitHub page</NativeText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL(PUNKAH_URL)}>
                  <NativeText style={style.link}>@punkah</NativeText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(MAENNCHEN_URL)}
                >
                  <NativeText style={style.link}>@maennchen</NativeText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
                >
                  <NativeText style={style.link}>Privacy policy</NativeText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URL)}
                >
                  <NativeText style={style.link}>Terms & Conditions</NativeText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={style.close}>
            <NativeButton onPress={onClose} title={'Close'} />
          </View>
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
    row: { flexDirection: 'row', flex: 1, flexWrap: 'wrap' },
    title: { fontSize: 22 },
    modalView: {
      width: '80%',
      height: '80%',
      margin: 20,
      backgroundColor: 'white',
      padding: 35,
      alignItems: 'flex-start',
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
      textDecorationLine: 'underline',
      marginTop: 10,
    },
    logo: {
      width: 104,
      height: 120,
      marginRight: 20,
      marginBottom: 20,
    },
    close: {
      alignSelf: 'flex-end',
    },
  });

export default InfoModal;
