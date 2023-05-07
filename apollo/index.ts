import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

export default function client(host: string) {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `wss://${host}/api/graphql-ws`,
    })
  );

  const httpLink = new HttpLink({
    uri: `https://${host}/api`,
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const baseClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        StockEntry: {
          keyFields: ['item', ['id'], 'location', ['id']],
        },
      },
    }),
    connectToDevTools: true,
  });

  return baseClient;
}
