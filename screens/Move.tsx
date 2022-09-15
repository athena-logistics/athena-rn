import { useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'i18n-js';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { DO_RELOCATE, DO_SUPPLY } from '../apollo/mutations';
import { RelocateInput, SupplyInput } from '../apollo/schema';
import {
  useLocationQuery,
  useLocationStockQuery,
} from '../apolloActions/useQueries';
import { useMovementSubscription } from '../apolloActions/useSubscriptions';
import NativeNumberOnlyInput from '../components/native/NativeNumberOnlyInput';
import NativePicker from '../components/native/NativePicker';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import isAndroid from '../constants/isAndroid';
import { getNodes } from '../helpers/apollo';
import { getGroupedData } from '../helpers/getGroupedData';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';
import { setLocations } from '../store/actions/global.actions';

export interface ItemState {
  stock: string;
  item: string;
}

interface MoveState {
  stuff: ItemState[];
}

export enum MoveActionType {
  Add,
  Change,
  Delete,
  Initialize,
}

export type AddStuffAction = {
  type: MoveActionType.Add;
};

export type ChangeStuffAction = {
  type: MoveActionType.Change;
  payload: {
    item: ItemState;
    index: number;
  };
};

export type DeleteStuffAction = {
  type: MoveActionType.Delete;
  payload: {
    index: number;
  };
};
export type InitializeAction = {
  type: MoveActionType.Initialize;
};

export type MoveAction =
  | AddStuffAction
  | ChangeStuffAction
  | DeleteStuffAction
  | InitializeAction;

export const defaultItem = { item: '', stock: '1' };
const emptyLocation = { name: i18n.t('initialSupply'), id: '-1' };

export const moveReducer = (
  state: MoveState,
  action: MoveAction
): MoveState => {
  switch (action.type) {
    case MoveActionType.Add:
      return {
        ...state,
        stuff: state.stuff.concat(defaultItem),
      };

    case MoveActionType.Change:
      const stuffs1 = [...state.stuff];
      stuffs1.splice(action.payload.index, 1, action.payload.item);
      return {
        ...state,
        stuff: stuffs1,
      };
    case MoveActionType.Delete:
      const stuffs2 = [...state.stuff];
      stuffs2.splice(action.payload.index, 1);
      return {
        ...state,
        stuff: stuffs2,
      };
    case MoveActionType.Initialize:
      return {
        ...state,
        stuff: [defaultItem],
      };

    default:
      return state;
  }
};

export interface ItemGroup {
  id: string;
  name: string;
}

const Move = ({}: {}) => {
  const reduxDispatch = useDispatch();
  const { isPortrait, isLandscape } = useOrientation();
  const isLargeScreen = Dimensions.get('screen').width > 800;

  const style = styles({ isPortrait, isLandscape, isLargeScreen });
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [moveState, dispatch] = useReducer(moveReducer, {
    stuff: [defaultItem],
  });

  const eventId = useSelector((state: RootState) => state.global.eventId);
  const locations = useSelector((state: RootState) => state.global.locations);
  const locationStock = useSelector(
    (state: RootState) => state.global.locationStock[from]
  );

  const [createSupplyMutation, { loading: supplyLoading }] =
    useMutation<SupplyInput>(DO_SUPPLY, {
      onCompleted: (data) => {
        // @ts-ignore
        if (data.supply.messages.length > 0) {
          // @ts-ignore
          data.supply.messages.forEach((message) => {
            Toast.show({
              type: 'error',
              text1: i18n.t('ohNo'),
              text2: message.field + ' ' + message.message,
            });
          });
        } else {
          Toast.show({
            text1: i18n.t('yay'),
            text2: i18n.t('successfulSupply'),
          });
          dispatch({ type: MoveActionType.Initialize });
        }
      },
    });
  const [createRelocateMutation, { loading: moveLoading, error: moveError }] =
    useMutation<RelocateInput>(DO_RELOCATE, {
      onCompleted: (data) => {
        // @ts-ignore
        if (data.relocate.messages.length > 0) {
          // @ts-ignore
          data.relocate.messages.forEach((message) => {
            Toast.show({
              type: 'error',
              text1: i18n.t('ohNo'),
              text2: message.field + ' ' + message.message,
            });
          });
        } else {
          Toast.show({
            text1: i18n.t('yay'),
            text2: i18n.t('successfulMove'),
          });
          dispatch({ type: MoveActionType.Initialize });
        }
      },
    });

  useMovementSubscription({
    locationId: from,
    onSubscriptionData: (data: any) => {
      fetch();
    },
  });

  const navigation = useNavigation();
  const { data, loading, error } = useLocationQuery(eventId);
  const [fetch] = useLocationStockQuery(from);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!error && !loading) {
      if (data && data.event?.__typename === 'Event') {
        const locations = [
          {
            name: i18n.t('locations'),
            id: 0,
            children: getNodes(data.event.locations).map((location: any) => ({
              name: location.name,
              id: location.id,
            })),
          },
        ];
        reduxDispatch(setLocations(locations));
      }
    }
  }, [data, error, loading]);

  const allItems = useSelector((state: RootState) => state.global.allItems);
  let availableItems = getGroupedData(allItems);
  let availableItemsWithUnit = availableItems.map((group) => ({
    ...group,
    children: group.children.map((item) => ({
      ...item,
      name: `${item.name} (${item.unit})`,
    })),
  }));

  let itemById: { [key: string]: StockItem } = {};
  availableItemsWithUnit.forEach((item) => {
    item.children.forEach((child) => {
      // @ts-ignore
      itemById[child.id] = child;
    });
  });

  let locationsById: { [key: string]: any } = {};
  locations.forEach((item) => {
    item.children.forEach((location: any) => {
      // @ts-ignore
      locationsById[location.id] = location;
    });
    locationsById['-1'] = emptyLocation;
  });
  if (locationStock) {
    itemById = locationStock.itemById;
    availableItems = getGroupedData(
      Object.values(locationStock.itemById).filter((item) => item.stock > 0)
    );
    availableItemsWithUnit = availableItems.map((group) => ({
      ...group,
      children: group.children.map((item) => ({
        ...item,
        name: `${item.name} (${item.unit}) [${item.stock}]`,
      })),
    }));
  }

  const route = useRoute();
  // @ts-ignore
  const moveItems: StockItem[] | undefined = route.params?.items;
  // @ts-ignore
  const moveTo: string | undefined = route.params?.to;

  useEffect(() => {
    // coming from missing items screen
    if (moveItems && moveTo && locations) {
      setTo(moveTo);
      dispatch({ type: MoveActionType.Initialize });
      moveItems.forEach((item: StockItem, index: number) => {
        dispatch({
          type: MoveActionType.Change,
          payload: {
            index: index,
            item: { stock: item.missingCount.toString(), item: item.id },
          },
        });
      });
    }
  }, [moveItems, moveTo, locations]);

  const save = useCallback(() => {
    if (moveState.stuff.length == 0) {
      return Toast.show({
        type: 'error',
        text2: 'Please select items',
      });
    }
    Promise.all(
      moveState.stuff.map(async (stuff) => {
        const amount = Number(stuff.stock);
        const sourceLocationId = from;
        const destinationLocationId = to;
        const itemId = stuff.item;
        if (!amount) {
          return Toast.show({
            type: 'error',
            text2: 'Please select amount',
          });
        }
        if (!from) {
          return Toast.show({
            type: 'error',
            text2: 'Please select source location',
          });
        }
        if (!to) {
          return Toast.show({
            type: 'error',
            text2: 'Please select destination location',
          });
        }

        if (amount && sourceLocationId && destinationLocationId && itemId) {
          if (sourceLocationId == '-1') {
            const variables: SupplyInput = {
              amount,
              locationId: destinationLocationId,
              itemId,
            };
            await createSupplyMutation({ variables });
          } else {
            if (sourceLocationId == destinationLocationId) {
              return Toast.show({
                type: 'error',
                text1: i18n.t('ohNo'),
                text2: 'Source and destination cannot be the same',
              });
            }
            const variables: RelocateInput = {
              amount,
              sourceLocationId,
              destinationLocationId,
              itemId,
            };
            await createRelocateMutation({ variables });
          }
        }
      })
    );
  }, [moveState, from, to]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerRight: () => (
        // <HeaderButtons HeaderButtonComponent={NativeHeaderButton}>
        //   <Item title="Save" iconName={'ios-checkmark'} />
        // </HeaderButtons>
        <Pressable onPress={save} disabled={moveLoading || supplyLoading}>
          {(moveLoading || supplyLoading) && (
            <ActivityIndicator
              size={'small'}
              color={isAndroid ? colors.white : colors.primary}
              style={{
                paddingRight: 20,
              }}
            />
          )}
          {!moveLoading && !supplyLoading && (
            <NativeText
              style={{
                paddingRight: 20,
                color: isAndroid ? colors.white : colors.primary,
              }}
            >
              {i18n.t('save')}
            </NativeText>
          )}
        </Pressable>
      ),
    });
  }, [navigation, save, moveLoading, supplyLoading]);

  const handleSetTo = (value: any) => {
    setTo(value);
  };

  const handleSetFrom = (value: any) => {
    setFrom(value);
  };

  const handleDelete = (index: number) => () => {
    dispatch({
      type: MoveActionType.Delete,
      payload: { index },
    });
  };

  const setStuffItem = (stuff: ItemState, index: number) => (item: string) => {
    dispatch({
      type: MoveActionType.Change,
      payload: { item: { ...stuff, item }, index },
    });
    if (index === moveState.stuff.length - 1) {
      dispatch({ type: MoveActionType.Add });
    }
  };

  const setStuffStock =
    (stuff: ItemState, index: number) => (stock: string) => {
      dispatch({
        type: MoveActionType.Change,
        payload: { item: { ...stuff, stock }, index },
      });
      if (index === moveState.stuff.length - 1) {
        dispatch({ type: MoveActionType.Add });
      }
    };

  const fromLocations = locations.map((location) => ({
    ...location,
    children: [emptyLocation].concat(location.children),
  }));

  return (
    <ScrollView style={{ flex: 1 }}>
      <NativeScreen style={style.screen}>
        <View style={style.fromToContainer}>
          <NativePicker
            items={fromLocations}
            selectedValue={from}
            setSelectedValue={handleSetFrom}
            placeholderText={i18n.t('from')}
            width="100%"
            itemById={locationsById}
          />
          <Ionicons
            size={33}
            name={
              isLargeScreen
                ? 'ios-arrow-forward-circle'
                : 'ios-arrow-down-circle'
            }
            style={style.arrowDown}
            color={colors.primary}
          />
          <NativePicker
            items={locations}
            selectedValue={to}
            setSelectedValue={handleSetTo}
            placeholderText={i18n.t('to')}
            width="100%"
            itemById={locationsById}
          />
        </View>
        {moveState.stuff.map((stuff, index) => (
          <View key={index} style={style.itemContainer}>
            <View
              style={[
                style.numberContainer,
                !stuff.item ? style.pending : null,
              ]}
              key={index}
            >
              <NativePicker
                items={availableItemsWithUnit}
                selectedValue={stuff.item}
                setSelectedValue={setStuffItem(stuff, index)}
                placeholderText={i18n.t('select')}
                alreadySelectedItems={moveState.stuff.map(
                  (stuff) => stuff.item
                )}
                itemById={itemById}
              />
              {!!stuff.item && (
                <Ionicons
                  size={25}
                  name={'ios-trash'}
                  color={colors.primary}
                  style={{ marginLeft: 10 }}
                  onPress={handleDelete(index)}
                />
              )}
            </View>
            {!!stuff.item && (
              <View style={style.actionContainer}>
                <NativeNumberOnlyInput
                  value={stuff.stock}
                  onChangeText={setStuffStock(stuff, index)}
                  max={itemById[stuff.item]?.stock}
                />
              </View>
            )}
          </View>
        ))}
      </NativeScreen>
    </ScrollView>
  );
};

const styles = ({ isPortrait, isLandscape, isLargeScreen }: Orientation) =>
  StyleSheet.create({
    screen: {
      justifyContent: 'flex-start',
    },
    fromToContainer: {
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: isLargeScreen ? 'row' : 'column',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    arrowDown: {
      marginVertical: isLargeScreen ? 0 : 10,
      marginHorizontal: isLargeScreen ? 10 : 0,
    },
    itemContainer: {
      flexDirection: isLargeScreen ? 'row' : 'column',
      alignContent: 'stretch',
      alignItems: 'stretch',
      width: '100%',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    numberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: isLargeScreen ? '50%' : '100%',
    },
    pending: {
      opacity: 0.7,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: isLargeScreen ? 0 : 10,
      width: isLargeScreen ? '50%' : '100%',
    },
  });

export default Move;
