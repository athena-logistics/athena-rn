import { gql } from '@apollo/client';

export const GET_EVENT_LOCATIONS = gql`
  query GetEventLocations($id: ID!) {
    event(id: $id) {
      name
      id
      locations(first: 1000) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_LOCATION_STOCK = gql`
  query GetLocationStock($id: ID!) {
    node(id: $id) {
      id
      __typename
      ... on Location {
        stock(first: 1000) {
          edges {
            node {
              stock
              item {
                id
                name
                unit
              }
              itemGroup {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_LOCATION_STOCK = gql`
  query GetAllLocationStock($id: ID!) {
    event(id: $id) {
      name
      id
      stock(first: 1000) {
        edges {
          node {
            item {
              id
              name
            }
            itemGroup {
              id
              name
            }
            location {
              id
              name
            }
            stock
            supply
            consumption
            movementIn
            movementOut
            status
          }
        }
      }
    }
  }
`;
