import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { HTTP_URL, WS_URL } from '../constants/app';
// import apolloLogger from 'apollo-link-logger';

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
  })
);

const httpLink = new HttpLink({
  uri: HTTP_URL,
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

const client = new ApolloClient({
  link: ApolloLink.from([
    // apolloLogger,
    splitLink,
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default client;
