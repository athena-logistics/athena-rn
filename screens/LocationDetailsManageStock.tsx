import { useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput, StockEntryStatus } from '../apollo/schema';
import { useLocationStockQuery } from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeNumberConsumptionInput from '../components/native/NativeNumberConsumptionInput';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import {
  AvailableItem,
  AvailableItemGroup,
} from '../models/AvailableItemGroup';
import { RootState } from '../store';

const LocationDetailsManageStock = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const route = useRoute();
  // @ts-ignore
  const location: LogisticLocation = route.params?.location;
  const [fetch, { loading }] = useLocationStockQuery(location?.id);
  const locationStock = useSelector(
    (state: RootState) => state.global.locationStock[location?.id]
  );
  const [createConsumeMutation] = useMutation<ConsumeInput>(DO_CONSUME);

  const [itemById, setitemById] = useState<{ [key: string]: Item }>({});
  const [availableItemGroups, setAvailableItemGroups] =
    useState<AvailableItemGroup[]>();

  useEffect(() => {
    fetch();
  }, []);

  useMovementSubscription({
    locationId: location?.id,
    onSubscriptionData: (data: any) => {
      fetch();
    },
  });

  useEffect(() => {
    if (locationStock) {
      setitemById(locationStock.itemById);
      setAvailableItemGroups(locationStock.availableItems);
    }
  }, [locationStock]);

  const consume =
    (item: AvailableItem) => async (newValue?: string, change?: number) => {
      console.log('consume', item.stock, newValue, change);
      const amount = change ? -change : Number(item.stock) - Number(newValue);
      const locationId = location.id;
      const itemId = item.id;
      if (!Number.isNaN(amount) && locationId && itemId) {
        console.log('good', amount);
        const variables: ConsumeInput = {
          amount,
          locationId,
          itemId,
        };
        await createConsumeMutation({ variables });
      }
    };

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: location?.name,
    });
  }, [navigation]);

  const getStatusIcon = (
    item: AvailableItem
  ): { iconName: any; iconColor: string } => {
    switch (item.status as StockEntryStatus) {
      case StockEntryStatus.Normal:
        return { iconName: 'airplane', iconColor: 'green' };
      case StockEntryStatus.Warning:
        return { iconName: 'airplane', iconColor: 'orange' };
      case StockEntryStatus.Important:
      default:
        return { iconName: 'airplane', iconColor: 'red' };
    }
  };

  const sectionData =
    availableItemGroups?.map((group) => ({
      name: group.name,
      id: group.id,
      data: group.children,
    })) || [];

  return (
    <NativeScreen style={style.screen}>
      <SectionList
        sections={sectionData}
        refreshing={loading}
        onRefresh={fetch}
        keyExtractor={(item) => item.id + item.stock}
        renderItem={({ item }) => (
          <View style={style.row} key={item.id + item.stock}>
            <View style={style.title}>
              <NativeText style={style.titleText}>{item.name}</NativeText>
            </View>

            <View style={style.leftContainer}>
              <View style={style.inputContainer}>
                <NativeNumberConsumptionInput
                  value={item.stock.toString()}
                  onChangeText={consume(item)}
                />
              </View>

              <View style={style.status}>
                <Ionicons
                  name={getStatusIcon(item).iconName}
                  size={23}
                  color={getStatusIcon(item).iconColor}
                />
              </View>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { name, id } }) => (
          <View style={style.row} key={id}>
            <NativeText>{name}</NativeText>
          </View>
        )}
      />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch', justifyContent: 'flex-start' },
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
    },
    subtitleText: {
      fontSize: 12,
    },
    inputContainer: {},
    numberText: { fontSize: 12, textTransform: 'uppercase' },
    number: { fontSize: 20, fontFamily: fonts.defaultFontFamilyBold },
    status: { marginLeft: 20 },
  });

export default LocationDetailsManageStock;
