import gql from 'graphql-tag';

export const STOCK_FRAGMENT = gql`
  fragment Stock on StockEntry {
    item {
      id
    }
    location {
      id
    }
    stock
    supply
    consumption
    movementIn
    movementOut
    status
    missingCount
  }
`;

export const STOCK_ENTRIES_FRAGMENT = gql`
  ${STOCK_FRAGMENT}
  fragment StockEntries on StockEntryConnection {
    edges {
      node {
        ...Stock
      }
    }
  }
`;

export const LOCATION_FRAGMENT = gql`
  fragment Location on Location {
    id
    name
  }
`;

export const ITEM_FRAGMENT = gql`
  fragment Item on Item {
    id
    name
    unit
    inverse
    itemGroup {
      id
    }
  }
`;

export const ITEM_GROUP_FRAGMENT = gql`
  fragment ItemGroup on ItemGroup {
    id
    name
  }
`;

export const STOCK_EXPECTATION_FRAGMENT = gql`
  fragment StockExpectation on StockExpectation {
    id
    importantThreshold
    warningThreshold
    item {
      id
    }
  }
`;

export const EVENT_CONFIGURATION_FRAGMENT = gql`
  ${ITEM_FRAGMENT}
  ${ITEM_GROUP_FRAGMENT}
  fragment EventConfiguration on Event {
    name
    items(first: 1000) {
      edges {
        node {
          ...Item
        }
      }
    }
    itemGroups(first: 1000) {
      edges {
        node {
          ...ItemGroup
        }
      }
    }
  }
`;

export const LOGISTIC_EVENT_CONFIGURATION_FRAGMENT = gql`
  ${EVENT_CONFIGURATION_FRAGMENT}
  ${STOCK_EXPECTATION_FRAGMENT}
  fragment LogisticEventConfiguration on Event {
    ...EventConfiguration
    id
    locations(first: 1000) {
      edges {
        node {
          ...Location
          stockExpectations(first: 1000) {
            edges {
              node {
                ...StockExpectation
              }
            }
          }
        }
      }
    }
    stock(first: 10000) {
      ...StockEntries
    }
  }
`;
