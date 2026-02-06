// =====================================
// src/apollo/client.js
// PURPOSE:
// This file CONFIGURES APOLLO CLIENT.
// It is responsible for:
// - Connecting the React app to Shopify Storefront GraphQL API
// - Sending domain, API version, and Storefront token
// - Managing GraphQL caching
//
// This client is used globally via <ApolloProvider> in main.jsx
// =====================================

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create Apollo Client instance
const client = new ApolloClient({
  // Shopify Storefront GraphQL endpoint
  link: new HttpLink({
    uri: `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
    headers: {
      // Public Storefront Access Token (safe for frontend)
      "X-Shopify-Storefront-Access-Token":
        import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,

      "Content-Type": "application/json",
    },
  }),

  // Cache configuration for GraphQL responses
  cache: new InMemoryCache(),
});

// Export client to be used in main.jsx
export default client;
