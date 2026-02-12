import { gql } from "@apollo/client";

/* GET PRODUCTS FROM SEARCH COLLECTION */
export const GET_SEARCH_SUGGESTIONS = gql`
  query getSearchSuggestions {
    collection(handle: "search-suggestions") {
      title
      products(first: 8) {
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
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
