import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import UserService from "../services/UserService";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "http://10.1.1.177:1700/graphql",
});

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: "ws://10.1.1.177:1700/graphql",
//     connectionParams: {
//       authToken: UserService.getToken() ? UserService.getToken() : "",
//     },
//   })
// );

// const wsLink = new WebSocketLink(
//   new SubscriptionClient("ws://10.1.1.177:1700/graphql", {
//     connectionParams: {
//       authToken: UserService.getToken() ? UserService.getToken() : "",
//     },
//   })
// );

const wsLink = new WebSocketLink({
  uri: "ws://10.1.1.177:1700/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: UserService.getToken()
        ? `Bearer ${UserService.getToken()}`
        : "",
    },
  };
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  // defaultOptions: defaultOptions,
});

export default client;
