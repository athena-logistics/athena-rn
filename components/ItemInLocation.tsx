import { FetchResult, MutationFunctionOptions } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ConsumeInput, StockEntryStatus } from '../apollo/schema';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import NativeNumberConsumptionInput from './native/NativeNumberConsumptionInput';
import NativeText from './native/NativeText';

const ItemInLocation = ({
  row,
  loading,
  createConsumeMutation,
}: {
  row: StockItem;
  loading: boolean;
  createConsumeMutation: (
    options?: MutationFunctionOptions
  ) => Promise<FetchResult>;
}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const consume =
    (item: StockItem) => async (newValue?: string, change?: number) => {
      console.log('consume', item.stock, newValue, change);
      const amount = change ? -change : Number(item.stock) - Number(newValue);
      const locationId = item.locationId;
      const itemId = item.id;
      if (!Number.isNaN(amount) && locationId && itemId) {
        console.log('consume changed', amount, itemId);
        const variables: ConsumeInput = {
          amount,
          locationId,
          itemId,
        };
        await createConsumeMutation({ variables });
      }
    };

  const navigation = useNavigation();
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Stock Item Details', { row });
  };

  return (
    <View style={style.row}>
      <View style={style.title}>
        <TouchableOpacity onPress={handlePress}>
          <NativeText style={style.titleText}>{row.locationName}</NativeText>
        </TouchableOpacity>
      </View>
      <View style={style.leftContainer}>
        <NativeNumberConsumptionInput
          value={row.stock + ''}
          onChangeText={consume(row)}
          loading={loading}
          editable={true}
          type={row.status as StockEntryStatus}
        />
      </View>
    </View>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      borderColor: colors.primary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderStyle: 'solid',
      paddingVertical: 10,
      width: '100%',
      overflow: 'hidden',
    },
    titleContainer: {},
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { overflow: 'hidden', flex: 1 },
    titleText: {
      fontSize: 18,
      fontFamily: fonts.defaultFontFamilyBold,
    },
    subtitleText: {
      fontSize: 12,
    },
  });

export default ItemInLocation;
