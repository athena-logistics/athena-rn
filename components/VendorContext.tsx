import { useQuery } from '@apollo/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import { useIntl } from 'react-intl';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  EVENT_CONFIGURATION_FRAGMENT,
  LOCATION_FRAGMENT,
  STOCK_ENTRIES_FRAGMENT,
} from '../apollo/fragments';
import {
  LocationDetailsQuery,
  LocationDetailsQueryVariables,
  LocationMovementCreatedSubscription,
  LocationMovementCreatedSubscriptionVariables,
  StockEntriesFragment,
} from '../apollo/schema';
import colors from '../constants/colors';
import { RootParamsList } from './AuthorizationNavigation';
import Crash from './Crash';
import VendorNavigation from './VendorNavigation';

export default function VendorContext({
  locationId,
  rootNavigation,
}: {
  locationId: string;
  rootNavigation: NavigationProp<RootParamsList>;
}): JSX.Element | null {
  const intl = useIntl();

  const navigation = useNavigation<NavigationProp<RootParamsList>>();

  const { data, loading, error, subscribeToMore, refetch } = useQuery<
    LocationDetailsQuery,
    LocationDetailsQueryVariables
  >(LOCATION_DETAIL_QUERY, {
    variables: { id: locationId },
    errorPolicy: 'none',
    pollInterval: 60000,
    onCompleted(data) {
      if (data.location !== null) return;

      Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'error.unknown.title',
          defaultMessage: 'Oh No!',
        }),
        text2: intl.formatMessage({
          id: 'error.locationNotFound.description',
          defaultMessage: 'The location could not be found.',
        }),
      });

      navigation.navigate('guest');
    },
  });

  const subscribeToNewMovements = subscribeToMore<
    LocationMovementCreatedSubscription,
    LocationMovementCreatedSubscriptionVariables
  >({
    document: MOVEMENT_CREATED_SUBSCRIPTION,
    variables: { id: data?.location?.id },
    onError: (error) => console.error(error),
    updateQuery: (previousResult, { subscriptionData }) => {
      if (!previousResult.location?.stock?.edges) return previousResult;
      if (!subscriptionData.data.movementCreated) return previousResult;

      let newStockEntries: StockEntriesFragment['edges'] = [];
      switch (subscriptionData.data.movementCreated.__typename) {
        case 'Supply':
        case 'Consumption':
          newStockEntries =
            subscriptionData.data.movementCreated.location.stock?.edges ?? [];

          break;
        case 'Relocation':
          newStockEntries =
            subscriptionData.data.movementCreated.sourceLocation.id ===
            data?.location?.id
              ? subscriptionData.data.movementCreated.sourceLocation.stock
                  ?.edges ?? []
              : subscriptionData.data.movementCreated.destinationLocation.stock
                  ?.edges ?? [];
          break;
      }

      return {
        ...previousResult,
        location: {
          ...previousResult.location,
          stock: {
            ...previousResult.location.stock,
            edges: [...newStockEntries],
          },
        },
      };
    },
  });

  if (loading && !data?.location) {
    return <ActivityIndicator size={'large'} color={colors.primary} />;
  }

  if (error) {
    console.error(error);

    return <Crash retry={() => refetch()} />;
  }

  if (!data?.location) return null;

  return (
    <VendorNavigation
      location={data.location}
      refetch={refetch}
      stateReloading={loading}
      rootNavigation={rootNavigation}
      subscribeToNewMovements={subscribeToNewMovements}
    />
  );
}

const LOCATION_DETAIL_QUERY = gql`
  ${STOCK_ENTRIES_FRAGMENT}
  ${LOCATION_FRAGMENT}
  ${EVENT_CONFIGURATION_FRAGMENT}
  query LocationDetails($id: ID!) {
    location(id: $id) {
      ...Location
      event {
        ...EventConfiguration
      }
      stock(first: 10000) {
        ...StockEntries
      }
    }
  }
`;

const MOVEMENT_CREATED_SUBSCRIPTION = gql`
  ${STOCK_ENTRIES_FRAGMENT}
  subscription LocationMovementCreated($id: ID) {
    movementCreated(locationId: $id) {
      id
      ... on Supply {
        location {
          stock(first: 1000) {
            ...StockEntries
          }
        }
      }
      ... on Consumption {
        location {
          stock(first: 1000) {
            ...StockEntries
          }
        }
      }
      ... on Relocation {
        sourceLocation {
          id
          stock(first: 1000) {
            ...StockEntries
          }
        }
        destinationLocation {
          id
          stock(first: 1000) {
            ...StockEntries
          }
        }
      }
    }
  }
`;
