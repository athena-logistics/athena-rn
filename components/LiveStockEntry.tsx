import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Toast from 'react-native-toast-message';
import {
  DoConsumeMutation,
  DoConsumeMutationVariables,
  StockFragment,
} from '../apollo/schema';
import getMutationResult from '../helpers/apollo';
import NativeNumberOnlyInput from './native/NativeNumberOnlyInput';

export default function LiveStockEntry({
  stockEntry,
  max,
}: {
  stockEntry: StockFragment;
  max?: number;
}) {
  const intl = useIntl();
  const [localStock, setLocalStock] = useState(stockEntry.stock);

  const [consumeMutation] = useMutation<
    DoConsumeMutation,
    DoConsumeMutationVariables
  >(DO_CONSUME);

  useEffect(() => {
    setLocalStock(stockEntry.stock);
  }, [stockEntry.stock]);

  async function consume(newStock: number) {
    const amountBefore = localStock;
    const change = amountBefore - newStock;

    setLocalStock((stock) => stock - change);

    function handleError(error: unknown) {
      console.error(error);

      setLocalStock((stock) => stock + change);

      Toast.show({
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

    await consumeMutation({
      variables: {
        amount: change,
        locationId: stockEntry.location.id,
        itemId: stockEntry.item.id,
      },
      onError: (error) => handleError(error),
      onCompleted: (data) => {
        if (!data.consume) return handleError(new Error('Not found!'));
        try {
          getMutationResult(data.consume);
        } catch (error) {
          handleError(error);
        }
      },
    });
  }

  return (
    <NativeNumberOnlyInput
      value={localStock}
      onChange={consume}
      // TODO: Find a way to update without a required re-render since it breaks
      // the editable field.
      key={localStock}
      editable={false}
      minValue={0}
      maxValue={max}
    />
  );
}

const DO_CONSUME = gql`
  mutation DoConsume($amount: Int!, $itemId: ID!, $locationId: ID!) {
    consume(
      input: { amount: $amount, itemId: $itemId, locationId: $locationId }
    ) {
      messages {
        code
        field
        message
        __typename
      }
      successful
      result {
        id
      }
    }
  }
`;
