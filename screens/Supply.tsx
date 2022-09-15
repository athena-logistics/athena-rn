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
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { DO_SUPPLY } from '../apollo/mutations';
import { SupplyInput } from '../apollo/schema';
import {
  useAllItemsQuery,
  useLocationQuery
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

interface ItemState {
  stock: string;
  item: string;
}

interface MoveState {
  stuff: ItemState[];
}

enum ActionType {
  Add,
  Change,
  Delete,
  Initialize,
}

export type AddStuffAction = {
  type: ActionType.Add;
};

export type ChangeStuffAction = {
  type: ActionType.Change;
  payload: {
    item: ItemState;
    index: number;
  };
};

export type DeleteStuffAction = {
  type: ActionType.Delete;
  payload: {
    index: number;
  };
};

export type InitializeAction = {
  type: ActionType.Initialize;
};
export type MoveAction =
  | AddStuffAction
  | ChangeStuffAction
  | DeleteStuffAction
  | InitializeAction;

const defaultItem = { item: '', stock: '1' };

const moveReducer = (state: MoveState, action: MoveAction): MoveState => {
  switch (action.type) {
    case ActionType.Add:
      return {
        ...state,
        stuff: state.stuff.concat(defaultItem),
      };
    case ActionType.Change:
      const stuffs1 = [...state.stuff];
      stuffs1.splice(action.payload.index, 1, action.payload.item);
      return {
        ...state,
        stuff: stuffs1,
      };
    case ActionType.Delete:
      const stuffs2 = [...state.stuff];
      stuffs2.splice(action.payload.index, 1);
      return {
        ...state,
        stuff: stuffs2,
      };
    case ActionType.Initialize:
      return {
        ...state,
        stuff: [defaultItem],
      };

    default:
      return state;
  }
};

const Supply = ({}: {}) => {
  const reduxDispatch = useDispatch();
  const { isPortrait, isLandscape } = useOrientation();
  const isLargeScreen = Dimensions.get('screen').width > 800;

  const style = styles({ isPortrait, isLandscape, isLargeScreen });
  const [to, setTo] = useState<string>('');

  const [moveState, dispatch] = useReducer(moveReducer, {
    stuff: [defaultItem],
  });

  const locations = useSelector((state: RootState) => state.global.locations);
  const eventId = useSelector((state: RootState) => state.global.eventId);
  const { data, loading, error } = useLocationQuery(eventId);

  const route = useRoute();
  // @ts-ignore
  const moveItems: StockItem[] | undefined = route.params?.items;
  // @ts-ignore
  const moveTo: string | undefined = route.params?.to;

  useEffect(() => {
    // coming from missing items screen
    if (moveItems && moveTo && locations) {
      setTo(moveTo);
      dispatch({ type: ActionType.Initialize });
      moveItems.forEach((item: StockItem, index: number) => {
        dispatch({
          type: ActionType.Change,
          payload: {
            index: index,
            item: { stock: item.missingCount.toString(), item: item.id },
          },
        });
      });
    }
  }, [moveItems, moveTo, locations]);

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

  const [fetch] = useAllItemsQuery(eventId);

  const allItems = useSelector((state: RootState) => state.global.allItems);

  const availableItems = getGroupedData(allItems);
  const availableItemsWithUnit = availableItems.map((group) => ({
    ...group,
    children: group.children.map((item) => ({
      ...item,
      name: `${item.name} (${item.unit})`,
    })),
  }));

  useMovementSubscription({
    locationId: to,
    onSubscriptionData: (data: any) => {
      fetch();
    },
  });

  useEffect(() => {
    fetch();
  }, []);


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
          dispatch({ type: ActionType.Initialize });
        }
      },
    });
  const save = useCallback(() => {
    Promise.all(
      moveState.stuff.map(async (stuff) => {
        const amount = Number(stuff.stock);
        const locationId = to;
        const itemId = stuff.item;
        if (amount && locationId && itemId) {
          const variables: SupplyInput = {
            amount,
            locationId,
            itemId,
          };
          await createSupplyMutation({ variables });
        }
      })
    ).then(() => fetch());
  }, [moveState]);

  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={save} disabled={supplyLoading}>
          {supplyLoading && (
            <ActivityIndicator
              size={'small'}
              color={isAndroid ? colors.white : colors.primary}
              style={{
                paddingRight: 20,
              }}
            />
          )}
          {!supplyLoading && (
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
  }, [navigation, supplyLoading, save]);

  const handleSetTo = (value: any) => {
    setTo(value);
  };

  const handleDelete = (index: number) => () => {
    dispatch({
      type: ActionType.Delete,
      payload: { index },
    });
  };

  const setStuffItem = (stuff: ItemState, index: number) => (item: string) => {
    dispatch({
      type: ActionType.Change,
      payload: { item: { ...stuff, item }, index },
    });
    if (index === moveState.stuff.length - 1) {
      dispatch({ type: ActionType.Add });
    }
  };

  const setStuffStock =
    (stuff: ItemState, index: number) => (stock: string) => {
      dispatch({
        type: ActionType.Change,
        payload: { item: { ...stuff, stock }, index },
      });
      if (index === moveState.stuff.length - 1) {
        dispatch({ type: ActionType.Add });
      }
    };

  let itemById: { [key: string]: StockItem } = {};
  availableItemsWithUnit.forEach((item) => {
    item.children.forEach((child) => {
      // @ts-ignore
      itemById[child.id] = child;
    });
  });

  let locationsById: { [key: string]: Location } = {};
  locations.forEach((item) => {
    item.children.forEach((location: any) => {
      // @ts-ignore
      locationsById[location.id] = location;
    });
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <NativeScreen style={style.screen}>
        <View style={style.fromToContainer}>
          <Ionicons
            size={33}
            name={'ios-arrow-down-circle'}
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
      padding: 20,
      flexDirection: isLargeScreen ? 'row' : 'column',
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

export default Supply;
