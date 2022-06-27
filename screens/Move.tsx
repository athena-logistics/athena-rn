import { useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { DO_RELOCATE } from '../apollo/mutations';
import { RelocateInput } from '../apollo/schema';
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
import { AvailableItemGroup } from '../models/AvailableItemGroup';
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

export type MoveAction = AddStuffAction | ChangeStuffAction | DeleteStuffAction;

export const defaultItem = { item: '', stock: '1' };

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
  const style = styles({ isPortrait, isLandscape });
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

  const [createRelocateMutation] = useMutation<RelocateInput>(DO_RELOCATE);

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
            name: 'Locations',
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

  let itemById: { [key: string]: StockItem } = {};
  let availableItems: AvailableItemGroup[] = [];
  if (locationStock) {
    itemById = locationStock.itemById;
    availableItems = getGroupedData(Object.values(locationStock.itemById));
  }

  const save = useCallback(() => {
    Promise.all(
      moveState.stuff.map(async (stuff) => {
        const amount = Number(stuff.stock);
        const sourceLocationId = from;
        const destinationLocationId = to;
        const itemId = stuff.item;
        if (amount && sourceLocationId && destinationLocationId && itemId) {
          const variables: RelocateInput = {
            amount,
            sourceLocationId,
            destinationLocationId,
            itemId,
          };
          await createRelocateMutation({ variables });
        }
      })
    );
  }, [moveState]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // @ts-ignore
      headerRight: () => (
        // <HeaderButtons HeaderButtonComponent={NativeHeaderButton}>
        //   <Item title="Save" iconName={'ios-checkmark'} />
        // </HeaderButtons>
        <Pressable onPress={save}>
          <NativeText
            style={{
              paddingRight: 20,
              color: isAndroid ? 'white' : colors.primary,
            }}
          >
            Save
          </NativeText>
        </Pressable>
      ),
    });
  }, [navigation, save]);

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
  };
  const handleAdd = () => {
    dispatch({ type: MoveActionType.Add });
  };
  const setStuffStock =
    (stuff: ItemState, index: number) => (stock: string) => {
      dispatch({
        type: MoveActionType.Change,
        payload: { item: { ...stuff, stock }, index },
      });
    };

  return (
    <ScrollView style={{ flex: 1 }}>
      <NativeScreen style={style.screen}>
        <View style={style.fromToContainer}>
          <NativePicker
            items={locations}
            selectedValue={from}
            setSelectedValue={handleSetFrom}
            placeholderText={'From...'}
            width="100%"
          />
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
            placeholderText={'To...'}
            width="100%"
          />
        </View>
        {!!from &&
          moveState.stuff.map((stuff, index) => (
            <React.Fragment key={index}>
              <View
                style={[
                  style.numberContainer,
                  !stuff.item ? style.pending : null,
                ]}
                key={index}
              >
                <NativePicker
                  items={availableItems}
                  selectedValue={stuff.item}
                  setSelectedValue={setStuffItem(stuff, index)}
                  alreadySelectedItems={moveState.stuff.map(
                    (stuff) => stuff.item
                  )}
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
                    unit={itemById[stuff.item]?.unit}
                  />
                  {itemById[stuff.item]?.unit && (
                    <NativeText>[{itemById[stuff.item]?.unit}]</NativeText>
                  )}
                </View>
              )}
            </React.Fragment>
          ))}
        {!!from && (
          <Pressable
            style={style.addNewContainer}
            onPress={handleAdd}
            android_ripple={{ color: colors.primary }}
          >
            <NativeText style={style.addNewText}>Add new stuff</NativeText>
            <Ionicons
              size={33}
              name={'ios-add-circle-outline'}
              color={'white'}
              style={{ marginLeft: 5 }}
            />
          </Pressable>
        )}
        {/* {Object.values(itemById).map((item) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              position: 'relative',
              height: 50,
            }}
          >
            <NativeText>{item.name}</NativeText>

            <View
              style={{
                width: '50%',
                position: 'absolute',
                left: '25%',
              }}
            >
              <NativeNumberOnlyInput
                value={item.requiredStock}
                onChangeText={(value) => {
                  itemById[item.id] = { ...item, requiredStock: value };
                }}
                max={item.stock}
                unit={item.unit}
              />
            </View>

            <NativeText type="bold" style={{ width: '23%' }}>
              [{item.unit}]
            </NativeText>
          </View>
        ))} */}
      </NativeScreen>
    </ScrollView>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: {
      justifyContent: 'flex-start',
    },
    fromToContainer: {
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    arrowDown: {
      marginVertical: 10,
    },
    numberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    pending: {
      opacity: 0.7,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50%',
    },
    addNewContainer: {
      flexDirection: 'row',
      alignItems: 'center',

      borderRadius: 10,

      backgroundColor: colors.primary,

      marginTop: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    addNewText: {
      color: 'white',
    },
    container: {
      width: '40%',
    },
  });

export default Move;
