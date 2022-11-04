import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";

import "@atlaskit/css-reset";
import App from "./App";
import { setupStore } from "./store/store";
import UserService from "./services/UserService";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <App />
// );

const store = setupStore();

const root = () =>
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  );

UserService.initKeycloak(root);
