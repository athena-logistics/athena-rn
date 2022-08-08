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
                inverse
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
  }
`;

export const GET_ALL_STOCK = gql`
  query GetAllStock($id: ID!) {
    event(id: $id) {
      name
      id
      stock(first: 1000) {
        edges {
          node {
            item {
              id
              name
              unit
              inverse
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

export const GET_ALL_ITEMS = gql`
  query GetAllItems($id: ID!) {
    event(id: $id) {
      name
      id
      items(first: 1000) {
        edges {
          node {
            id
            name
            unit
            inverse
            itemGroup {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_INTERNAL_LOCATION_ID = gql`
  query GetInternalLocationId($id: ID!) {
    location(id: $id) {
      id
      name
      event {
        name
      }
    }
  }
`;
