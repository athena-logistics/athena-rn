import { gql } from '@apollo/client';

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
        field
        message
        template
      }
      successful
    }
  }
`;

export const DO_SUPPLY = gql`
  mutation DoSupply($amount: Int!, $itemId: ID!, $locationId: ID!) {
    supply(
      input: { amount: $amount, itemId: $itemId, locationId: $locationId }
    ) {
      messages {
        field
        message
        template
      }
      successful
    }
  }
`;

export const DO_CONSUME = gql`
  mutation DoConsume($amount: Int!, $itemId: ID!, $locationId: ID!) {
    consume(
      input: { amount: $amount, itemId: $itemId, locationId: $locationId }
    ) {
      messages {
        field
        message
        template
      }
      successful
    }
  }
`;
