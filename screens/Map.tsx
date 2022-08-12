import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';

const Map = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  return (
    <ReactNativeZoomableView
      //   maxZoom={2}
      //   minZoom={0.1}
      maxZoom={1.5}
      minZoom={0.15}
      zoomStep={0.5}
      initialZoom={0.15}
      // // Give these to the zoomable view so it can apply the boundaries around the actual content.
      // // Need to make sure the content is actually centered and the width and height are
      // // dimensions when it's rendered naturally. Not the intrinsic size.
      // // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
      // // Therefore, we'll feed the zoomable view the 300x150 size.
      contentWidth={2200}
      contentHeight={2734}
    >
      <View>
        <Image source={require('../assets/map.jpg')} />
      </View>
    </ReactNativeZoomableView>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { flexDirection: 'row' },
    row: {
      flexDirection: 'row',
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    cell: {
      width: 60,
    },
    cellText: {
      transform: [{ rotate: '-45 deg' }],
      fontSize: 12,
    },
    headerCell: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    header: {
      paddingTop: 70,
      flexDirection: 'column',
    },
    list: {
      alignSelf: 'flex-start',
    },
    titleText: {
      fontSize: 16,
      fontFamily: fonts.defaultFontFamilyBold,
    },
  });

export default Map;
