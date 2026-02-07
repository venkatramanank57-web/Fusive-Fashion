// ==========================================
// InspirationReelsCollection.js
// Get products from "Inspiration Reels" collection
// ==========================================

import { gql } from "@apollo/client";

export const GET_INSPIRATION_REELS_PRODUCTS = gql`
  query GetInspirationReelsProducts {
    collectionByHandle(handle: "inspiration-reels") {
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
