import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Date Generic Type
   *
   * Example: `2021-05-04 11:44:10.858225Z`
   */
  Datetime: any;
};

export type ConsumeInput = {
  amount?: Scalars['Int'];
  itemId: Scalars['ID'];
  locationId: Scalars['ID'];
};

export type ConsumePayload = {
  __typename?: 'ConsumePayload';
  /** A list of failed validations. May be blank or null if mutation succeeded. */
  messages?: Maybe<Array<Maybe<ValidationMessage>>>;
  /** The object created/updated/deleted by the mutation. May be null if mutation failed. */
  result?: Maybe<Consumption>;
  /** Indicates if the mutation completed successfully or not. */
  successful: Scalars['Boolean'];
};

export type Consumption = Movement & Node & Resource & {
  __typename?: 'Consumption';
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  item: Item;
  itemGroup: ItemGroup;
  location: Location;
  updatedAt: Scalars['Datetime'];
};

export type Event = Node & Resource & {
  __typename?: 'Event';
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  itemGroups?: Maybe<ItemGroupConnection>;
  items?: Maybe<ItemConnection>;
  locations?: Maybe<LocationConnection>;
  movements?: Maybe<MovementConnection>;
  name: Scalars['String'];
  stock?: Maybe<StockEntryConnection>;
  updatedAt: Scalars['Datetime'];
};


export type EventItemGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventMovementsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventStockArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Item = Node & Resource & {
  __typename?: 'Item';
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  inverse: Scalars['Boolean'];
  itemGroup: ItemGroup;
  movements?: Maybe<MovementConnection>;
  name: Scalars['String'];
  stock?: Maybe<StockEntryConnection>;
  unit: Scalars['String'];
  updatedAt: Scalars['Datetime'];
};


export type ItemMovementsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ItemStockArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ItemConnection = {
  __typename?: 'ItemConnection';
  edges: Array<ItemEdge>;
  pageInfo: PageInfo;
};

export type ItemEdge = {
  __typename?: 'ItemEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Item>;
};

export type ItemGroup = Node & Resource & {
  __typename?: 'ItemGroup';
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  items?: Maybe<ItemConnection>;
  movements?: Maybe<MovementConnection>;
  name: Scalars['String'];
  stock?: Maybe<StockEntryConnection>;
  updatedAt: Scalars['Datetime'];
};


export type ItemGroupItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ItemGroupMovementsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ItemGroupStockArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ItemGroupConnection = {
  __typename?: 'ItemGroupConnection';
  edges: Array<ItemGroupEdge>;
  pageInfo: PageInfo;
};

export type ItemGroupEdge = {
  __typename?: 'ItemGroupEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<ItemGroup>;
};

export type Location = Node & Resource & {
  __typename?: 'Location';
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  itemGroups?: Maybe<ItemGroupConnection>;
  items?: Maybe<ItemConnection>;
  movementsIn?: Maybe<MovementConnection>;
  movementsOut?: Maybe<MovementConnection>;
  name: Scalars['String'];
  stock?: Maybe<StockEntryConnection>;
  updatedAt: Scalars['Datetime'];
};


export type LocationItemGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type LocationItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type LocationMovementsInArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type LocationMovementsOutArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type LocationStockArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type LocationConnection = {
  __typename?: 'LocationConnection';
  edges: Array<LocationEdge>;
  pageInfo: PageInfo;
};

export type LocationEdge = {
  __typename?: 'LocationEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Location>;
};

export type Movement = {
  event: Event;
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  item: Item;
  itemGroup: ItemGroup;
  updatedAt: Scalars['Datetime'];
};

export type MovementConnection = {
  __typename?: 'MovementConnection';
  edges: Array<MovementEdge>;
  pageInfo: PageInfo;
};

export type MovementEdge = {
  __typename?: 'MovementEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Movement>;
};

export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type RelocateInput = {
  amount?: Scalars['Int'];
  destinationLocationId: Scalars['ID'];
  itemId: Scalars['ID'];
  sourceLocationId: Scalars['ID'];
};

export type RelocatePayload = {
  __typename?: 'RelocatePayload';
  /** A list of failed validations. May be blank or null if mutation succeeded. */
  messages?: Maybe<Array<Maybe<ValidationMessage>>>;
  /** The object created/updated/deleted by the mutation. May be null if mutation failed. */
  result?: Maybe<Relocation>;
  /** Indicates if the mutation completed successfully or not. */
  successful: Scalars['Boolean'];
};

export type Relocation = Movement & Node & Resource & {
  __typename?: 'Relocation';
  destinationLocation: Location;
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  item: Item;
  itemGroup: ItemGroup;
  sourceLocation: Location;
  updatedAt: Scalars['Datetime'];
};

export type Resource = {
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
};

export type RootMutationType = {
  __typename?: 'RootMutationType';
  consume?: Maybe<ConsumePayload>;
  relocate?: Maybe<RelocatePayload>;
  supply?: Maybe<SupplyPayload>;
};


export type RootMutationTypeConsumeArgs = {
  input: ConsumeInput;
};


export type RootMutationTypeRelocateArgs = {
  input: RelocateInput;
};


export type RootMutationTypeSupplyArgs = {
  input: SupplyInput;
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Get Event By ID */
  event?: Maybe<Event>;
  /** Get Location By ID */
  location?: Maybe<Location>;
  node?: Maybe<Node>;
};


export type RootQueryTypeEventArgs = {
  id: Scalars['ID'];
};


export type RootQueryTypeLocationArgs = {
  id: Scalars['ID'];
};


export type RootQueryTypeNodeArgs = {
  id: Scalars['ID'];
};

export type RootSubscriptionType = {
  __typename?: 'RootSubscriptionType';
  movementCreated?: Maybe<Movement>;
};


export type RootSubscriptionTypeMovementCreatedArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
  locationId?: InputMaybe<Scalars['ID']>;
};

export type StockEntry = {
  __typename?: 'StockEntry';
  consumption: Scalars['Int'];
  item: Item;
  itemGroup: ItemGroup;
  location: Location;
  movementIn: Scalars['Int'];
  movementOut: Scalars['Int'];
  status: StockEntryStatus;
  stock: Scalars['Int'];
  supply: Scalars['Int'];
};

export type StockEntryConnection = {
  __typename?: 'StockEntryConnection';
  edges: Array<StockEntryEdge>;
  pageInfo: PageInfo;
};

export type StockEntryEdge = {
  __typename?: 'StockEntryEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<StockEntry>;
};

export enum StockEntryStatus {
  Important = 'IMPORTANT',
  Normal = 'NORMAL',
  Warning = 'WARNING'
}

export type Supply = Movement & Node & Resource & {
  __typename?: 'Supply';
  event: Event;
  /** The ID of an object */
  id: Scalars['ID'];
  insertedAt: Scalars['Datetime'];
  item: Item;
  itemGroup: ItemGroup;
  location: Location;
  updatedAt: Scalars['Datetime'];
};

export type SupplyInput = {
  amount?: Scalars['Int'];
  itemId: Scalars['ID'];
  locationId: Scalars['ID'];
};

export type SupplyPayload = {
  __typename?: 'SupplyPayload';
  /** A list of failed validations. May be blank or null if mutation succeeded. */
  messages?: Maybe<Array<Maybe<ValidationMessage>>>;
  /** The object created/updated/deleted by the mutation. May be null if mutation failed. */
  result?: Maybe<Supply>;
  /** Indicates if the mutation completed successfully or not. */
  successful: Scalars['Boolean'];
};

/**
 * Validation messages are returned when mutation input does not meet the requirements.
 *   While client-side validation is highly recommended to provide the best User Experience,
 *   All inputs will always be validated server-side.
 *
 *   Some examples of validations are:
 *
 *   * Username must be at least 10 characters
 *   * Email field does not contain an email address
 *   * Birth Date is required
 *
 *   While GraphQL has support for required values, mutation data fields are always
 *   set to optional in our API. This allows 'required field' messages
 *   to be returned in the same manner as other validations. The only exceptions
 *   are id fields, which may be required to perform updates or deletes.
 */
export type ValidationMessage = {
  __typename?: 'ValidationMessage';
  /** A unique error code for the type of validation used. */
  code: Scalars['String'];
  /**
   * The input field that the error applies to. The field can be used to
   * identify which field the error message should be displayed next to in the
   * presentation layer.
   *
   * If there are multiple errors to display for a field, multiple validation
   * messages will be in the result.
   *
   * This field may be null in cases where an error cannot be applied to a specific field.
   */
  field?: Maybe<Scalars['String']>;
  /**
   * A friendly error message, appropriate for display to the end user.
   *
   * The message is interpolated to include the appropriate variables.
   *
   * Example: `Username must be at least 10 characters`
   *
   * This message may change without notice, so we do not recommend you match against the text.
   * Instead, use the *code* field for matching.
   */
  message?: Maybe<Scalars['String']>;
  /** A list of substitutions to be applied to a validation message template */
  options?: Maybe<Array<Maybe<ValidationOption>>>;
  /**
   * A template used to generate the error message, with placeholders for option substiution.
   *
   * Example: `Username must be at least {count} characters`
   *
   * This message may change without notice, so we do not recommend you match against the text.
   * Instead, use the *code* field for matching.
   */
  template?: Maybe<Scalars['String']>;
};

export type ValidationOption = {
  __typename?: 'ValidationOption';
  /** The name of a variable to be subsituted in a validation message template */
  key: Scalars['String'];
  /** The value of a variable to be substituted in a validation message template */
  value: Scalars['String'];
};

export type GetEventLocationsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetEventLocationsQuery = { __typename?: 'RootQueryType', event?: { __typename?: 'Event', name: string, id: string, locations?: { __typename?: 'LocationConnection', edges: Array<{ __typename?: 'LocationEdge', node?: { __typename?: 'Location', id: string, name: string } | null }> } | null } | null };

export type GetLocationStockQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetLocationStockQuery = { __typename?: 'RootQueryType', node?: { __typename: 'Consumption', id: string } | { __typename: 'Event', id: string } | { __typename: 'Item', id: string } | { __typename: 'ItemGroup', id: string } | { __typename: 'Location', id: string, stock?: { __typename?: 'StockEntryConnection', edges: Array<{ __typename?: 'StockEntryEdge', node?: { __typename?: 'StockEntry', stock: number, supply: number, consumption: number, movementIn: number, movementOut: number, status: StockEntryStatus, item: { __typename?: 'Item', id: string, name: string, unit: string, inverse: boolean }, itemGroup: { __typename?: 'ItemGroup', id: string, name: string }, location: { __typename?: 'Location', id: string, name: string } } | null }> } | null } | { __typename: 'Relocation', id: string } | { __typename: 'Supply', id: string } | null };

export type GetAllStockQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAllStockQuery = { __typename?: 'RootQueryType', event?: { __typename?: 'Event', name: string, id: string, stock?: { __typename?: 'StockEntryConnection', edges: Array<{ __typename?: 'StockEntryEdge', node?: { __typename?: 'StockEntry', stock: number, supply: number, consumption: number, movementIn: number, movementOut: number, status: StockEntryStatus, item: { __typename?: 'Item', id: string, name: string, unit: string, inverse: boolean }, itemGroup: { __typename?: 'ItemGroup', id: string, name: string }, location: { __typename?: 'Location', id: string, name: string } } | null }> } | null } | null };

export type GetAllItemsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAllItemsQuery = { __typename?: 'RootQueryType', event?: { __typename?: 'Event', name: string, id: string, items?: { __typename?: 'ItemConnection', edges: Array<{ __typename?: 'ItemEdge', node?: { __typename?: 'Item', id: string, name: string, unit: string, inverse: boolean, itemGroup: { __typename?: 'ItemGroup', id: string, name: string } } | null }> } | null } | null };

export type GetInternalLocationIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetInternalLocationIdQuery = { __typename?: 'RootQueryType', location?: { __typename?: 'Location', id: string, name: string } | null };


export const GetEventLocations = gql`
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
export const GetLocationStock = gql`
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
export const GetAllStock = gql`
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
export const GetAllItems = gql`
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
export const GetInternalLocationId = gql`
    query GetInternalLocationId($id: ID!) {
  location(id: $id) {
    id
    name
  }
}
    `;