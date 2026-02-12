import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    products(first: 20, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
          }
          priceRange {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
`;
