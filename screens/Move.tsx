import { gql, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {
  DoRelocateMutation,
  DoRelocateMutationVariables,
  DoSupplyMutation,
  DoSupplyMutationVariables,
  ItemFragment,
  LocationFragment,
  LogisticEventConfigurationFragment,
} from '../apollo/schema';
import NativeNumberOnlyInput from '../components/native/NativeNumberOnlyInput';
import NativePicker from '../components/native/NativePicker';
import NativeScreen from '../components/native/NativeScreen';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import getMutationResult, {
  MutationFailedMessageError,
  getNodes,
} from '../helpers/apollo';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import {
  ItemState,
  MoveActionType,
  defaultItem,
  useItemStore,
} from './Move/store';

export default function Move({
  event,
  from: initialFrom,
  to: initialTo,
  items: initialItems,
}: {
  event: LogisticEventConfigurationFragment;
  from?: LocationFragment;
  to?: LocationFragment;
  items?: ItemState[];
}) {
  const intl = useIntl();

  const initialSupplyLocation = {
    id: '-1',
    name: intl.formatMessage({
      id: 'location.initialSupply',
      defaultMessage: 'Initial Supply',
    }),
  };
  const locations = getNodes(event.locations);

  const { isPortrait, isLandscape } = useOrientation();
  const isLargeScreen = Dimensions.get('screen').width > 800;
  const style = styles({ isPortrait, isLandscape, isLargeScreen });

  const [from, setFrom] = useState<LocationFragment>(
    initialFrom ?? initialSupplyLocation,
  );
  const [to, setTo] = useState<LocationFragment | null>(initialTo ?? null);

  const allItems = getNodes(event.items);
  const availableItems =
    from.id === '-1'
      ? allItems
      : allItems.filter((item) => {
          return getNodes(event.stock).some(
            (stock) =>
              stock.item.id === item.id && stock.location.id === from.id,
          );
        });

  const maxAvailablePerItem = Object.fromEntries(
    allItems.map((item) => {
      const stock = getNodes(event.stock).find(
        (stock) => stock.item.id === item.id && stock.location.id === from.id,
      );
      return [item.id, stock?.stock ?? (from.id === '-1' ? 1000 : 0)];
    }),
  );

  const groupedAvailableItems = Object.entries(
    availableItems
      .map((item) => ({ ...item, name: `${item.name} (${item.unit})` }))
      .reduce(
        (acc, item) => ({
          ...acc,
          [item.itemGroup.id]: [...(acc[item.itemGroup.id] ?? []), item],
        }),
        {} as Record<string, ItemFragment[]>,
      ),
  ).map(([itemGroupId, items]) => {
    const itemGroup = getNodes(event.itemGroups).find(
      (itemGroup) => itemGroup.id === itemGroupId,
    );

    return {
      ...itemGroup,
      children: items,
    };
  });

  const [moveState, dispatch] = useItemStore({
    stuff: initialItems ?? [{ ...defaultItem }],
  });

  function handleMutationError(error: unknown) {
    if (error instanceof MutationFailedMessageError) {
      return Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'error.unknown.title',
          defaultMessage: 'Oh No!',
        }),
        text2:
          error.mutationMessage.field + ' ' + error.mutationMessage.message,
      });
    }

    console.error(error);

    return Toast.show({
      type: 'error',
      text1: intl.formatMessage({
        id: 'error.unknown.title',
        defaultMessage: 'Oh No!',
      }),
      text2: intl.formatMessage({
        id: 'error.unknown.description',
        defaultMessage: 'Something went wrong.',
      }),
    });
  }

  const [createSupplyMutation, { loading: supplyLoading }] = useMutation<
    DoSupplyMutation,
    DoSupplyMutationVariables
  >(DO_SUPPLY, {
    onCompleted: (data) => {
      try {
        if (!data?.supply) throw new Error('Not Found');
        getMutationResult(data.supply);
        Toast.show({
          text1: intl.formatMessage({
            id: 'confirmation.unknown.title',
            defaultMessage: 'Yay!',
          }),
          text2: intl.formatMessage({
            id: 'move.success.supply',
            defaultMessage: 'Successfuly supplied stuff.',
          }),
        });
        dispatch({ type: MoveActionType.Initialize });
      } catch (error) {
        handleMutationError(error);
      }
    },
    onError: handleMutationError,
    errorPolicy: 'none',
  });

  const [createRelocateMutation, { loading: moveLoading }] = useMutation<
    DoRelocateMutation,
    DoRelocateMutationVariables
  >(DO_RELOCATE, {
    onCompleted: (data) => {
      try {
        if (!data?.relocate) throw new Error('Not Found');
        getMutationResult(data.relocate);
        Toast.show({
          text1: intl.formatMessage({
            id: 'confirmation.unknown.title',
            defaultMessage: 'Yay!',
          }),
          text2: intl.formatMessage({
            id: 'move.success.move',
            defaultMessage: 'Successfuly moved stuff.',
          }),
        });
        dispatch({ type: MoveActionType.Initialize });
      } catch (error) {
        handleMutationError(error);
      }
    },
    onError: handleMutationError,
    errorPolicy: 'none',
  });

  const navigation = useNavigation();

  const save = useCallback(() => {
    if (!to) {
      return Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'error.unknown.title',
          defaultMessage: 'Oh No!',
        }),
        text2: intl.formatMessage({
          id: 'error.destinationLocationRequired.description',
          defaultMessage: 'Please select destination location',
        }),
      });
    }

    if (from.id == to.id) {
      return Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'error.unknown.title',
          defaultMessage: 'Oh No!',
        }),
        text2: intl.formatMessage({
          id: 'error.sourceAndDestinationEqual.description',
          defaultMessage: 'Source and destination cannot be the same',
        }),
      });
    }

    Promise.all(
      moveState.stuff.map(async (stuff) => {
        if (!stuff.item) return;

        if (from.id == '-1') {
          return await createSupplyMutation({
            variables: {
              amount: stuff.amount,
              locationId: to.id,
              itemId: stuff.item.id,
            },
          });
        }

        const variables: DoRelocateMutationVariables = {
          amount: stuff.amount,
          sourceLocationId: from.id,
          destinationLocationId: to.id,
          itemId: stuff.item.id,
        };
        await createRelocateMutation({ variables });
      }),
    );
  }, [moveState, from, to]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={save} disabled={moveLoading || supplyLoading}>
          {(moveLoading || supplyLoading) && (
            <ActivityIndicator
              size={'small'}
              color={colors.white}
              style={{ paddingRight: 20 }}
            />
          )}
          {!moveLoading && !supplyLoading && (
            <NativeText style={{ paddingRight: 20, color: colors.white }}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </NativeText>
          )}
        </Pressable>
      ),
    });
  }, [navigation, save, moveLoading, supplyLoading]);

  const handleDelete = (index: number) => () => {
    dispatch({
      type: MoveActionType.Delete,
      payload: { index },
    });
  };

  const setStuffItem = (
    stuff: ItemState,
    index: number,
    item: ItemFragment | null,
  ) => {
    dispatch({
      type: MoveActionType.Change,
      payload: { ...stuff, item, index },
    });
    if (index === moveState.stuff.length - 1) {
      dispatch({ type: MoveActionType.Add });
    }
  };

  const setItemAmount =
    (stuff: ItemState, index: number) => (amount: number) => {
      dispatch({
        type: MoveActionType.Change,
        payload: { ...stuff, amount, index },
      });
      if (index === moveState.stuff.length - 1) {
        dispatch({ type: MoveActionType.Add });
      }
    };

  return (
    <ScrollView style={{ flex: 1 }}>
      <NativeScreen style={style.screen}>
        <View style={style.fromToContainer}>
          <View style={{ width: '100%', flex: 1 }}>
            <NativePicker
              items={[
                {
                  id: 'initialSupply',
                  name: intl.formatMessage({
                    id: 'location.initialSupply',
                    defaultMessage: 'Initial Supply',
                  }),
                  children: [initialSupplyLocation],
                },
                {
                  id: 'locations',
                  name: intl.formatMessage({
                    id: 'model.location',
                    defaultMessage: 'Location',
                  }),
                  children: locations,
                },
              ]}
              subKey="children"
              selectedItems={[from.id]}
              onSelectedItemsChange={() => undefined}
              onSelectedItemObjectsChange={([location]) =>
                setFrom((location as LocationFragment) ?? initialSupplyLocation)
              }
              renderSelectText={({ selectText }) => {
                return <NativeText>{from?.name ?? selectText}</NativeText>;
              }}
              placeholder={intl.formatMessage({
                id: 'move.location.from',
                defaultMessage: 'From',
              })}
              readOnlyHeadings={true}
              single={true}
              uniqueKey="id"
            />
          </View>
          <Ionicons
            size={33}
            name={isLargeScreen ? 'arrow-forward-circle' : 'arrow-down-circle'}
            style={style.arrowDown}
            color={colors.primary}
          />
          <View style={{ width: '100%', flex: 1 }}>
            <NativePicker
              items={locations}
              selectedItems={[to?.id]}
              onSelectedItemsChange={() => undefined}
              onSelectedItemObjectsChange={([location]) =>
                setTo(location as LocationFragment)
              }
              renderSelectText={({ selectText }) => {
                return <NativeText>{to?.name ?? selectText}</NativeText>;
              }}
              placeholder={intl.formatMessage({
                id: 'move.location.to',
                defaultMessage: 'To',
              })}
              single={true}
              uniqueKey="id"
            />
          </View>
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
              <View style={{ width: '100%', flex: 1 }}>
                <NativePicker
                  items={groupedAvailableItems}
                  subKey="children"
                  selectedItems={[stuff.item?.id]}
                  onSelectedItemsChange={() => undefined}
                  onSelectedItemObjectsChange={([item]) =>
                    setStuffItem(stuff, index, item as ItemFragment)
                  }
                  renderSelectText={({ selectText }) => {
                    return (
                      <NativeText>{stuff?.item?.name ?? selectText}</NativeText>
                    );
                  }}
                  placeholder={intl.formatMessage({
                    id: 'model.item',
                    defaultMessage: 'Item',
                  })}
                  readOnlyHeadings={true}
                  single={true}
                  uniqueKey="id"
                />
              </View>
              {!!stuff.item && index > 0 && (
                <Ionicons
                  size={25}
                  name={'trash'}
                  color={colors.primary}
                  style={{ marginLeft: 10 }}
                  onPress={handleDelete(index)}
                />
              )}
            </View>
            {!!stuff.item && (
              <View style={style.actionContainer}>
                <NativeNumberOnlyInput
                  value={stuff.amount}
                  onChange={setItemAmount(stuff, index)}
                  minValue={0}
                  maxValue={maxAvailablePerItem[stuff.item.id]}
                />
              </View>
            )}
          </View>
        ))}
      </NativeScreen>
    </ScrollView>
  );
}

const styles = ({ isLargeScreen }: Orientation) =>
  StyleSheet.create({
    screen: {
      justifyContent: 'flex-start',
      paddingBottom: 20,
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

export const DO_RELOCATE = gql`
  mutation DoRelocate(
    $amount: Int!
    $itemId: ID!
    $sourceLocationId: ID!
    $destinationLocationId: ID!
  ) {
    relocate(
      input: {
        amount: $amount
        itemId: $itemId
        sourceLocationId: $sourceLocationId
        destinationLocationId: $destinationLocationId
      }
    ) {
      messages {
        code
        field
        message
      }
      successful
      result {
        id
      }
    }
  }
`;

export const DO_SUPPLY = gql`
  mutation DoSupply($amount: Int!, $itemId: ID!, $locationId: ID!) {
    supply(
      input: { amount: $amount, itemId: $itemId, locationId: $locationId }
    ) {
      messages {
        code
        field
        message
      }
      successful
      result {
        id
      }
    }
  }
`;
