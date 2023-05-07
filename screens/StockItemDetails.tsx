import { useMutation } from '@apollo/client';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { STOCK_EXPECTATION_FRAGMENT } from '../apollo/fragments';
import {
  LogisticEventConfigurationFragment,
  SetStockExpectationMutation,
  SetStockExpectationMutationVariables,
  StockEntryStatus,
  StockExpectationFragment,
  StockFragment,
} from '../apollo/schema';
import LiveStockEntry from '../components/LiveStockEntry';
import { LogisticsParamsList } from '../components/LogisticNavigation';
import IonIcon from '../components/native/IonIcon';
import NativeNumberOnlyInput from '../components/native/NativeNumberOnlyInput';
import NativeText from '../components/native/NativeText';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import getMutationResult, {
  MutationFailedMessageError,
  getNodes,
} from '../helpers/apollo';

export default function StockItemDetails({
  stockEntry,
  event,
  refetch,
}: {
  stockEntry: StockFragment;
  event: LogisticEventConfigurationFragment;
  refetch: () => void;
}) {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProp<LogisticsParamsList>>();

  const item = getNodes(event.items).find(
    (item) => item.id === stockEntry.item.id
  );
  if (!item) throw new Error('Inconsistent State');
  const itemGroup = getNodes(event.itemGroups).find(
    (itemGroup) => itemGroup.id === item.itemGroup.id
  );
  if (!itemGroup) throw new Error('Inconsistent State');
  const location = getNodes(event.locations).find(
    (location) => location.id === stockEntry.location.id
  );
  if (!location) throw new Error('Inconsistent State');

  const stockExpectations = getNodes(location.stockExpectations);

  const [hasChangedStockExpectation, setHasChangedStockExpectation] =
    useState(false);
  const [localStockExpectation, setLocalStockExpectation] =
    useState<StockExpectationFragment>(
      stockExpectations.find(
        (stockExpectation) => stockExpectation.item.id === item.id
      ) ?? {
        id: '-1',
        item: { id: item.id },
        importantThreshold: item.inverse ? 100 : 0,
        warningThreshold: item.inverse ? 100 : 0,
      }
    );

  useEffect(() => {
    const newStockExpectation = stockExpectations.find(
      (stockExpectation) => stockExpectation.item.id === item.id
    );

    if (!newStockExpectation) return;

    setLocalStockExpectation(newStockExpectation);
    setHasChangedStockExpectation(false);
  }, [event]);

  function updateStockExpectationWarningThreshold(
    which: 'warningThreshold' | 'importantThreshold'
  ) {
    return (threshold: number) => {
      setLocalStockExpectation((stockExpectation) => ({
        ...stockExpectation,
        [which]: threshold,
      }));
      setHasChangedStockExpectation(true);
    };
  }

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

  const [setStockExpectationMutation, { loading: saveLoading }] = useMutation<
    SetStockExpectationMutation,
    SetStockExpectationMutationVariables
  >(SET_STOCK_EXPECTATION, {
    onCompleted: (data) => {
      try {
        if (!data?.setStockExpectation) throw new Error('Not Found');
        getMutationResult(data.setStockExpectation);
        Toast.show({
          text1: intl.formatMessage({
            id: 'confirmation.unknown.title',
            defaultMessage: 'Yay!',
          }),
          text2: intl.formatMessage({
            id: 'stockExpectation.success.save',
            defaultMessage: 'Successfuly saved stock expectation.',
          }),
        });
        refetch();
      } catch (error) {
        handleMutationError(error);
      }
    },
    onError: handleMutationError,
    errorPolicy: 'none',
  });

  const save = async () => {
    await setStockExpectationMutation({
      variables: {
        itemId: item?.id,
        locationId: location.id,
        warningThreshold: localStockExpectation.warningThreshold,
        importantThreshold: localStockExpectation.importantThreshold,
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (hasChangedStockExpectation) {
          return (
            <Pressable onPress={save} disabled={saveLoading}>
              {saveLoading && (
                <ActivityIndicator
                  size={'small'}
                  color={colors.white}
                  style={{ paddingRight: 20 }}
                />
              )}
              {!saveLoading && (
                <NativeText style={{ paddingRight: 20, color: colors.white }}>
                  <FormattedMessage id="save" defaultMessage="Save" />
                </NativeText>
              )}
            </Pressable>
          );
        }

        return (
          <NativeText
            style={{
              color: colors.white,
              padding: 10,
            }}
          >
            {location?.name}
          </NativeText>
        );
      },
    });
  }, [navigation, save, saveLoading]);

  const kvPairs = [
    {
      key: <FormattedMessage id="model.item.unit" defaultMessage="Unit" />,
      value: item.unit,
    },
    {
      key: (
        <FormattedMessage id="model.stockEntry.stock" defaultMessage="Stock" />
      ),
      value: (
        <>
          <Octicons
            name="dot-fill"
            size={20}
            color={getIconColor(stockEntry.status)}
          />{' '}
          <FormattedNumber value={stockEntry.stock} />
        </>
      ),
    },
    {
      key: (
        <FormattedMessage
          id="model.stockEntry.consumption"
          defaultMessage="Consumption"
        />
      ),
      value: <FormattedNumber value={stockEntry.consumption} />,
    },
    {
      key: (
        <FormattedMessage
          id="model.stockEntry.movements"
          defaultMessage="Movements"
        />
      ),
      complexValue: (
        <>
          <NativeText>
            <IonIcon name="arrow-down" color={colors.green} />{' '}
            <FormattedNumber value={stockEntry.movementIn} />
          </NativeText>
          <NativeText>
            <IonIcon name="arrow-up" color={colors.red} />{' '}
            <FormattedNumber value={stockEntry.movementOut} />
          </NativeText>
        </>
      ),
    },
    {
      key: (
        <FormattedMessage
          id="model.stockEntry.supply"
          defaultMessage="Supply"
        />
      ),
      value: <FormattedNumber value={stockEntry.supply} />,
    },
    {
      key: (
        <FormattedMessage
          id="model.stockEntry.missingCount"
          defaultMessage="Missing"
        />
      ),
      value: <FormattedNumber value={stockEntry.missingCount} />,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NativeText style={styles.sectionTitle}>
        <FormattedMessage
          id="screen.stockItemDetails.baseData"
          defaultMessage="Base Data"
        />
      </NativeText>
      <View style={styles.kvPairs}>
        {kvPairs.map(({ key, value, complexValue }, index) => (
          <View key={index} style={styles.kvPair}>
            <NativeText style={styles.key}>{key}</NativeText>

            {complexValue ? complexValue : <NativeText>{value}</NativeText>}
          </View>
        ))}
      </View>
      <NativeText style={styles.sectionTitle}>
        <FormattedMessage
          id="screen.stockItemDetails.stockExpectation"
          defaultMessage="Stock Expectation"
        />
      </NativeText>
      <View
        style={[
          styles.stockExpectationContainer,
          item.inverse ? styles.inverse : null,
        ]}
      >
        <NativeNumberOnlyInput
          onChange={updateStockExpectationWarningThreshold(
            'importantThreshold'
          )}
          value={localStockExpectation.importantThreshold}
          textColor={colors.red}
          key={`important-threshold-${localStockExpectation.id}`}
        />
        <NativeNumberOnlyInput
          onChange={updateStockExpectationWarningThreshold('warningThreshold')}
          value={localStockExpectation.warningThreshold}
          textColor={colors.orange}
          key={`warning-threshold-${localStockExpectation.id}`}
        />
        <View>
          <NativeText style={{ fontSize: 44 }}>
            <Ionicons
              size={44}
              name={'checkmark-circle'}
              color={colors.green}
            />

            {item.inverse ? (
              <FormattedNumber value={0} />
            ) : (
              <FormattedNumber value={Infinity} signDisplay="never" />
            )}
          </NativeText>
        </View>
      </View>
      <NativeText style={styles.sectionTitle}>
        <FormattedMessage
          id="screen.stockItemDetails.stock"
          defaultMessage="Stock"
        />
      </NativeText>
      <LiveStockEntry stockEntry={stockEntry} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 25,
  },
  kvPairs: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
  },
  kvPair: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    minWidth: 100,
    maxWidth: 150,
  },
  key: {
    fontFamily: fonts.defaultFontFamilyBold,
  },
  valueRow: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
  },
  stockExpectationContainer: {
    flexDirection: 'column',
  },
  inverse: {
    flexDirection: 'column-reverse',
  },
});

function getIconColor(status: StockEntryStatus): string {
  switch (status) {
    case StockEntryStatus.Normal:
      return colors.green;
    case StockEntryStatus.Important:
      return colors.red;
    case StockEntryStatus.Warning:
    default:
      return colors.orange;
  }
}

const SET_STOCK_EXPECTATION = gql`
  ${STOCK_EXPECTATION_FRAGMENT}
  mutation SetStockExpectation(
    $itemId: ID!
    $locationId: ID!
    $importantThreshold: Int!
    $warningThreshold: Int!
  ) {
    setStockExpectation(
      input: {
        locationId: $locationId
        itemId: $itemId
        importantThreshold: $importantThreshold
        warningThreshold: $warningThreshold
      }
    ) {
      messages {
        code
        field
        message
      }
      successful
      result {
        ...StockExpectation
      }
    }
  }
`;
