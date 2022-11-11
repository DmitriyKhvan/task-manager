import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import UserService from "../services/UserService";

const link = createHttpLink({
  uri: "http://10.1.1.177:1701/graphql",
  // uri: process.env.GQ_URL,
  credentials: "same-origin",
});

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
  link: authLink.concat(link),
  // cache: new InMemoryCache(),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  // defaultOptions: defaultOptions,
});

export default client;
