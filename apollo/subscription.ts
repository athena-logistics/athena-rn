import { gql } from '@apollo/client';

export const MOVEMENT_SUBSCRIPTION = gql`
  subscription MovementSubscription($eventId: ID, $locationId: ID) {
    movementCreated(eventId: $eventId, locationId: $locationId) {
      __typename
    }
  }
`;
