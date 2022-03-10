import { useSubscription } from '@apollo/client';
import { RootSubscriptionTypeMovementCreatedArgs } from '../apollo/schema';
import { MOVEMENT_SUBSCRIPTION } from '../apollo/subscription';

export const useMovementSubscription = ({
  eventId,
  locationId,
  onSubscriptionData,
}: {
  eventId?: string;
  locationId?: string;
  onSubscriptionData: any;
}) => {
  return useSubscription<RootSubscriptionTypeMovementCreatedArgs>(
    MOVEMENT_SUBSCRIPTION,
    {
      variables: {
        eventId,
        locationId,
      },
      onSubscriptionData,
    }
  );
};
