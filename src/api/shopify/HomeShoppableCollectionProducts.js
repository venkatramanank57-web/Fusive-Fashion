// ==========================================
// HomeShoppableCollectionProducts.js
// Get products from "Home Shoppable Video" collection
// ==========================================

import { gql } from "@apollo/client";

export const GET_HOME_SHOPPABLE_PRODUCTS = gql`
  query GetHomeShoppableProducts {
    collectionByHandle(handle: "home-shoppable-video") {
      id
      title
      description

      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType

            featuredImage {
              url
              altText
            }

            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }

            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
