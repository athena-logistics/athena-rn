import { BaseSubscriptionOptions, OnDataOptions, OperationVariables, useSubscription } from '@apollo/client';
import { RootSubscriptionTypeMovementCreatedArgs } from '../apollo/schema';
import { MOVEMENT_SUBSCRIPTION } from '../apollo/subscription';

export const useMovementSubscription = ({
  eventId,
  locationId,
  onData,
}: {
  eventId?: string;
  locationId?: string;
  onData: (options: OnDataOptions<RootSubscriptionTypeMovementCreatedArgs>) => any;
}) => {
  return useSubscription<RootSubscriptionTypeMovementCreatedArgs>(
    MOVEMENT_SUBSCRIPTION,
    {
      variables: {
        eventId,
        locationId,
      },
      onData,
    }
  );
};
