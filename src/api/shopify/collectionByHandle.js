import { gql } from "@apollo/client";

export const GET_COLLECTION_BY_HANDLE = gql`
  query getCollectionByHandle(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      description

      products(
        first: 100
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        edges {
          node {
            id
            title
            handle
            vendor
            tags

            featuredImage {
              url
              altText
            }

            images(first: 5) {
              edges {
                node {
                  url
                }
              }
            }

            variants(first: 20) {
              edges {
                node {
                  image {
                    url
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }

            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
