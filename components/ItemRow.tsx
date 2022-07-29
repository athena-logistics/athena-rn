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

const ItemRow = ({
  row,
  loading,
  createConsumeMutation,
  variant,
}: {
  row: StockItem;
  loading: boolean;
  createConsumeMutation: (
    options?: MutationFunctionOptions
  ) => Promise<FetchResult>;
  variant: 'nameAndUnit' | 'location';
}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const isInverse = row.inverse;
  const style = styles(
    { isPortrait, isLandscape },
    { isInverse: variant === 'nameAndUnit' ? isInverse : false }
  );

  const navigation = useNavigation();
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Stock Item Details', { row });
  };

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

  return (
    <View style={style.row}>
      <TouchableOpacity onPress={handlePress}>
        <View style={style.rightContainer}>
          <View style={style.title}>
            {variant === 'nameAndUnit' && (
              <>
                <NativeText style={style.titleText}>{row.name}</NativeText>
                <NativeText style={style.subtitleText}>{row.unit}</NativeText>
              </>
            )}
            {variant === 'location' && (
              <NativeText style={style.titleText}>
                {row.locationName}
              </NativeText>
            )}
          </View>
        </View>
      </TouchableOpacity>
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

const styles = (
  { isPortrait, isLandscape }: Orientation,
  { isInverse }: { isInverse: boolean }
) =>
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
    rightContainer: {
      flexShrink: 1,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { overflow: 'hidden', flex: 1, justifyContent: 'center' },
    titleText: {
      fontSize: 18,
      fontFamily: fonts.defaultFontFamilyBold,
      color: isInverse ? colors.secondary : colors.primary,
    },
    subtitleText: {
      fontSize: 12,
    },
  });

export default ItemRow;
