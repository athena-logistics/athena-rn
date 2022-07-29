import { FetchResult, MutationFunctionOptions } from '@apollo/client';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
  const [localRow, setLocalRow] = useState(row);

  useEffect(() => {
    setLocalRow(row);
  }, [row]);

  const { isPortrait, isLandscape } = useOrientation();
  const isInverse = row.inverse;
  const style = styles(
    { isPortrait, isLandscape },
    { isInverse: variant === 'nameAndUnit' ? isInverse : false }
  );

  const navigation = useNavigation();
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate('Stock Item Details', { stockItem: row });
  };

  const consume = async (newValue?: string, change?: number) => {
    console.log('consume', row.stock, localRow.stock, newValue, change);
    const amount = change ? -change : Number(localRow.stock) - Number(newValue);
    const locationId = row.locationId;
    const itemId = row.id;
    if (!Number.isNaN(amount) && locationId && itemId) {
      console.log('consume changed', amount, itemId);
      const variables: ConsumeInput = {
        amount,
        locationId,
        itemId,
      };
      await createConsumeMutation({ variables });
      setLocalRow((row) => ({
        ...row,
        stock: row.stock - amount,
      }));
    }
  };

  const color =
    row.status === StockEntryStatus.Important
      ? colors.red
      : row.status === StockEntryStatus.Warning
      ? colors.orange
      : row.status === StockEntryStatus.Normal
      ? colors.green
      : '';

  return (
    <View style={style.row}>
      <TouchableOpacity onPress={handlePress}>
        <View style={style.rightContainer}>
          <View style={style.status}>
            <Octicons name="dot-fill" size={30} color={color} />
          </View>
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
          value={localRow.stock + ''}
          onChangeText={consume}
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
    status: { marginRight: 10 },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { overflow: 'hidden', justifyContent: 'center' },
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
