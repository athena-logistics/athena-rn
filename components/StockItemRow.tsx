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

const StockItemRow = ({
  row,
  isEditing,
  loading,
  createConsumeMutation,
}: {
  row: StockItem;
  isEditing: boolean;
  loading: boolean;
  createConsumeMutation: (
    options?: MutationFunctionOptions
  ) => Promise<FetchResult>;
}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const isInverse = row.inverse;
  const style = styles({ isPortrait, isLandscape }, { isInverse });

  // const getStatusIcon = (): { iconName: any; iconColor: string } => {
  //   switch (row.status as StockEntryStatus) {
  //     case StockEntryStatus.Normal:
  //       return { icornName: 'airplane', iconColor: 'green' };
  //     case StockEntryStatus.Warning:
  //       return { iconName: 'airplane', iconColor: 'orange' };
  //     case StockEntryStatus.Important:
  //     default:
  //       return { iconName: 'airplane', iconColor: 'red' };
  //   }
  // };

  // const { iconName, iconColor } = getStatusIcon();

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
        <View style={style.title}>
          <NativeText style={style.titleText}>{row.name}</NativeText>
          <NativeText style={style.subtitleText}>{row.unit}</NativeText>
        </View>
      </TouchableOpacity>
      <View style={style.leftContainer}>
        <View style={style.numberContainer}>
          <NativeNumberConsumptionInput
            value={row.stock + ''}
            onChangeText={consume(row)}
            loading={loading}
            editable={isEditing}
            type={row.status as StockEntryStatus}
          />
        </View>
        {/* <View style={style.status}>
            <Ionicons name={iconName} size={23} color={iconColor} />
          </View> */}
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
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { overflow: 'hidden', flex: 1 },
    titleText: {
      fontSize: 20,
      fontFamily: fonts.defaultFontFamilyBold,
      color: isInverse ? colors.secondary : colors.primary,
    },
    subtitleText: {
      fontSize: 12,
    },
    numberContainer: { alignItems: 'center' },
    numberText: { fontSize: 12, textTransform: 'uppercase' },
    number: { fontSize: 20, fontFamily: fonts.defaultFontFamilyBold },
    status: { marginLeft: 20 },
  });

export default StockItemRow;
