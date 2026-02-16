// ======================================================
// src/main.jsx
// ENTRY POINT of the React App
// This file connects ALL global providers:
//
// ✔ Redux (global state)
// ✔ Redux Persist (keeps cart after refresh)
// ✔ Apollo Client (Shopify GraphQL API)
// ✔ React Router (page navigation)
// ✔ Search Context (global search overlay)
// ✔ Removes initial HTML loader (App Shell)
// ======================================================

import React from "react";
import ReactDOM from "react-dom/client";

// React Router – enables routing like /cart, /products/:handle
import { BrowserRouter } from "react-router-dom";

// Redux – global state management (cart, wishlist, customer)
import { Provider } from "react-redux";
import { store } from "./app/store";

// Redux Persist – keeps Redux state after page refresh
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Apollo Client – connects React to Shopify Storefront API
import { ApolloProvider } from "@apollo/client/react";
import client from "./apollo/client";

// Global Search overlay context
import { SearchProvider } from "./context/SearchContext";

// Root App component
import App from "./App";

// Tailwind + global styles
import "./styles/index.css";

// Create persistor instance for Redux Persist
const persistor = persistStore(store);

// ======================================================
// 🔥 REMOVE HTML APP SHELL LOADER
// This removes the loader from index.html
// AFTER React + CSS + Fonts fully loaded
// Prevents footer flash & layout jump
// ======================================================
window.addEventListener("load", () => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.4s ease";

    // remove after fade animation
    setTimeout(() => {
      loader.remove();
    }, 400);
  }
});

// ======================================================
// RENDER THE REACT APPLICATION
// ======================================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider → Global state available everywhere */}
    <Provider store={store}>

      {/* PersistGate → Wait until Redux state restored from storage */}
      <PersistGate loading={null} persistor={persistor}>

        {/* ApolloProvider → Enables Shopify GraphQL queries */}
        <ApolloProvider client={client}>

          {/* BrowserRouter → Enables URL routing */}
          <BrowserRouter>

            {/* SearchProvider → Global search overlay */}
            <SearchProvider>

              {/* Main App */}
              <App />

            </SearchProvider>
          </BrowserRouter>

        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
