// ================================
// src/main.jsx
// PURPOSE:
// This is the ENTRY POINT of the React app.
// Here we CONNECT all core providers:
// - Redux (global state)
// - Redux Persist (save state on refresh)
// - Apollo Client (Shopify Storefront API)
// - React Router (page navigation)
// ================================

import React from "react";
import ReactDOM from "react-dom/client";

// React Router – enables routing like /cart, /products/:handle
import { BrowserRouter } from "react-router-dom";

// Redux – global state management (cart, customer, wishlist)
import { Provider } from "react-redux";
import { store } from "./app/store";

// Redux Persist – keeps Redux data even after page refresh
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Apollo Client – connects React app to Shopify Storefront GraphQL API
import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo/client";

// Root App component
import App from "./App";

// Global Tailwind + base styles
import "./styles/index.css";

// Create persistor instance for Redux Persist
const persistor = persistStore(store);

// Render the React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider: makes Redux store available to entire app */}
    <Provider store={store}>
      {/* PersistGate: waits until persisted state is restored */}
      <PersistGate loading={null} persistor={persistor}>
        {/* ApolloProvider: enables Shopify GraphQL queries everywhere */}
        <ApolloProvider client={client}>
          {/* BrowserRouter: enables URL-based navigation */}
          <BrowserRouter>
            {/* Main App component */}
            <App />
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
