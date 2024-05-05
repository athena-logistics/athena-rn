import { useQuery } from '@apollo/client';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import { useIntl } from 'react-intl';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  LOCATION_FRAGMENT,
  LOGISTIC_EVENT_CONFIGURATION_FRAGMENT,
  STOCK_ENTRIES_FRAGMENT,
} from '../apollo/fragments';
import {
  EventDetailsQuery,
  EventDetailsQueryVariables,
  EventMovementCreatedSubscription,
  EventMovementCreatedSubscriptionVariables,
  StockEntriesFragment,
} from '../apollo/schema';
import colors from '../constants/colors';
import { RootParamsList } from './AuthorizationNavigation';
import Crash from './Crash';
import LogisticNavigation from './LogisticNavigation';

export default function LogisticsContext({
  eventId,
  rootNavigation,
}: {
  eventId: string;
  rootNavigation: NavigationProp<RootParamsList>;
}): JSX.Element | null {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProp<RootParamsList>>();

  const { data, loading, error, subscribeToMore, refetch } = useQuery<
    EventDetailsQuery,
    EventDetailsQueryVariables
  >(EVENT_DETAIL_QUERY, {
    variables: { id: eventId },
    errorPolicy: 'none',
    pollInterval: 60000,
    onCompleted(data) {
      if (data.event !== null) return;

      Toast.show({
        type: 'error',
        text1: intl.formatMessage({
          id: 'error.unknown.title',
          defaultMessage: 'Oh No!',
        }),
        text2: intl.formatMessage({
          id: 'error.eventNotFound.description',
          defaultMessage: 'The event could not be found.',
        }),
      });

      navigation.navigate('guest');
    },
  });

  const subscribeToNewMovements = subscribeToMore<
    EventMovementCreatedSubscription,
    EventMovementCreatedSubscriptionVariables
  >({
    document: MOVEMENT_CREATED_SUBSCRIPTION,
    variables: { id: data?.event?.id },
    onError(error) {
      console.error(error);
    },
    updateQuery: (previousResult, { subscriptionData }) => {
      if (!previousResult.event?.stock?.edges) return previousResult;
      if (!subscriptionData.data.movementCreated) return previousResult;

      const newStockEntries: StockEntriesFragment['edges'] = [];
      switch (subscriptionData.data.movementCreated.__typename) {
        case 'Supply':
        case 'Consumption':
          newStockEntries.push(
            ...(subscriptionData.data.movementCreated.location.stock?.edges ??
              []),
          );
          break;
        case 'Relocation':
          newStockEntries.push(
            ...(subscriptionData.data.movementCreated.sourceLocation.stock
              ?.edges ?? []),
            ...(subscriptionData.data.movementCreated.destinationLocation.stock
              ?.edges ?? []),
          );
          break;
      }

      const newStockBlocklist = new Set(
        newStockEntries.map(
          (edge) => `${edge.node?.location.id}-${edge.node?.item.id}`,
        ),
      );

      return {
        ...previousResult,
        event: {
          ...previousResult.event,
          stock: {
            ...previousResult.event.stock,
            edges: [
              ...newStockEntries,
              ...previousResult.event.stock.edges.filter(
                (edge) =>
                  !newStockBlocklist.has(
                    `${edge.node?.location.id}-${edge.node?.item.id}`,
                  ),
              ),
            ],
          },
        },
      };
    },
  });

  if (loading && !data?.event) {
    return <ActivityIndicator size={'large'} color={colors.primary} />;
  }

  if (error) {
    console.error(error);

    return <Crash retry={() => refetch()} />;
  }

  if (!data?.event) return null;

  return (
    <LogisticNavigation
      event={data.event}
      refetch={() => refetch()}
      stateReloading={loading}
      rootNavigation={rootNavigation}
      subscribeToNewMovements={subscribeToNewMovements}
    />
  );
}

const EVENT_DETAIL_QUERY = gql`
  ${STOCK_ENTRIES_FRAGMENT}
  ${LOCATION_FRAGMENT}
  ${LOGISTIC_EVENT_CONFIGURATION_FRAGMENT}
  query EventDetails($id: ID!) {
    event(id: $id) {
      ...LogisticEventConfiguration
    }
  }
`;

const MOVEMENT_CREATED_SUBSCRIPTION = gql`
  ${STOCK_ENTRIES_FRAGMENT}
  subscription EventMovementCreated($id: ID) {
    movementCreated(eventId: $id) {
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
          stock(first: 1000) {
            ...StockEntries
          }
        }
        destinationLocation {
          stock(first: 1000) {
            ...StockEntries
          }
        }
      }
    }
  }
`;
