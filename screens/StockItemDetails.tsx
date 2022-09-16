import { useMutation } from '@apollo/client';
import { Octicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import i18n from 'i18n-js';
import moment from 'moment';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput, StockEntryStatus } from '../apollo/schema';
import {
  useAllStockQuery,
  useItemLocationTotalQuery,
} from '../apolloActions/useQueries';
import NativeNumberConsumptionInput from '../components/native/NativeNumberConsumptionInput';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const StockItemDetails = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const route = useRoute();
  // @ts-ignore
  const item: StockItem = route.params?.stockItem;
  if (!item) {
    return null;
  }

  useItemLocationTotalQuery(item.id, item.locationId);

  const totals = useSelector(
    (state: RootState) =>
      state.global.itemLocationTotalsById[item.id + item.locationId]
  );

  const getStatusIcon = (): { iconColor: string } => {
    switch (item.status as StockEntryStatus) {
      case StockEntryStatus.Normal:
        return { iconColor: colors.green };
      case StockEntryStatus.Important:
        return { iconColor: colors.red };
      case StockEntryStatus.Warning:
      default:
        return { iconColor: colors.orange };
    }
  };

  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  let eventId: string;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const { iconColor } = getStatusIcon();
  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);

  const [createConsumeMutation, { loading: consumeLoading }] =
    useMutation<ConsumeInput>(DO_CONSUME, {
      onError: (error) => {
        console.log('error', error);
      },
      onCompleted: (data) => {
        // @ts-ignore
        if (data.consume.messages.length > 0) {
          // @ts-ignore
          data.consume.messages.forEach((message) => {
            if (message.__typename === 'ValidationMessage') {
              console.log('error', message.field + ' ' + message.message);
              Toast.show({
                type: 'error',
                text1: 'error',
                text2: message.field + ' ' + message.message,
              });
            }
          });
          // refetch after an error
          fetchStock();
        }
      },
    });
  const consume = async (newValue?: string, change?: number) => {
    const amount = change ? -change : Number(item.stock) - Number(newValue);
    const locationId = item.locationId;
    const itemId = item.id;
    if (!Number.isNaN(amount) && locationId && itemId) {
      const variables: ConsumeInput = {
        amount,
        locationId,
        itemId,
      };
      await createConsumeMutation({ variables });
    }
  };

  return (
    <NativeScreen style={style.screen}>
      <View style={style.item}>
        <View style={style.title}>
          <View style={style.status}>
            <Octicons name="dot-fill" size={30} color={iconColor} />
          </View>
          <View>
            <NativeText style={style.titleText}>{item.locationName}</NativeText>
            <NativeText>{item.name}</NativeText>
          </View>
        </View>
        <View style={style.leftContainer}>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.itemGroupName}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('itemGroup')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.unit}</NativeText>
            <NativeText style={style.numberText}>{i18n.t('unit')}</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.stock}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('inStock')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.consumption}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('consumption')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.movementIn}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('movementIn')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.movementOut}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('movementOut')}
            </NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.supply}</NativeText>
            <NativeText style={style.numberText}>{i18n.t('supply')}</NativeText>
          </View>
          <View style={style.numberContainer}>
            <NativeText style={style.number}>{item.missingCount}</NativeText>
            <NativeText style={style.numberText}>
              {i18n.t('missing')}
            </NativeText>
          </View>
        </View>
        <View style={style.bottomContainer}>
          <NativeNumberConsumptionInput
            value={item.stock + ''}
            max={item.inverse ? 0 : item.stock + item.missingCount}
            onChangeText={consume}
            loading={loadingStock}
            editable={true}
            type={item.status as StockEntryStatus}
            style={style.numberInputStyle}
          />
        </View>
        <View style={style.chartContainer}>
          {totals && (
            <LineChart
              data={{
                labels: totals.map((total) => total.date),
                datasets: [{ data: totals.map((total) => total.amount) }],
              }}
              width={Dimensions.get('window').width}
              height={300}
              chartConfig={{
                backgroundGradientFrom: '#644508',
                backgroundGradientTo: '#c88a11',
                color: (opacity = 3) => `rgba(255, 255, 255, ${opacity})`,
              }}
              formatYLabel={(value) => Number(value).toFixed(0)}
              formatXLabel={(value) => moment(value).format('MMM DD HH:mm')}
              fromZero={true}
            />
          )}
        </View>
      </View>
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch', justifyContent: 'flex-start' },
    item: {
      // justifyContent: 'space-between',
      flex: 1,
    },
    leftContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      flexDirection: 'row',
      marginBottom: 20,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    status: { marginRight: 10 },
    titleText: {
      fontSize: 20,
      fontFamily: fonts.defaultFontFamilyBold,
    },
    subtitleText: {
      fontSize: 12,
    },
    numberContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginBottom: 5,
    },
    numberText: {
      fontSize: 12,
      textTransform: 'uppercase',
      paddingLeft: 5,
    },
    number: {
      fontSize: 20,
      fontFamily: fonts.defaultFontFamilyBold,
      flexBasis: '50%',
      textAlign: 'right',
      paddingRight: 5,
    },
    bottomContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    numberInputStyle: {
      fontSize: 36,
      color: colors.primary,
      fontFamily: fonts.defaultFontFamily,
    },
    chartContainer: {
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      flex: 1,
    },
  });

export default StockItemDetails;
