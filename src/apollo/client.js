// =====================================
// src/apollo/client.js
// =====================================

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create Apollo Client instance
const client = new ApolloClient({
  // Shopify Storefront GraphQL endpoint
  link: new HttpLink({
    uri: `https://${import.meta.env.VITE_SHOPIFY_DOMAIN}/api/${import.meta.env.VITE_SHOPIFY_API_VERSION}/graphql.json`,
    headers: {
      "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
      "Content-Type": "application/json",
    },
  }),

  // ⭐ CACHE OPTIMIZATION: Idhu dhaan console warning-ah stop pannum
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        fields: {
          featuredImage: {
            // Existing and Incoming data-va merge panna solliduvom
            merge(existing, incoming) {
              return { ...existing, ...incoming };
            },
          },
        },
      },
      // Images-ku ID illana, URL-ah vechi identify panna idhu help pannum
      Image: {
        keyFields: ["url"],
      },
    },
  }),
});

export default client;