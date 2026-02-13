// =====================================
// src/api/shopify/searchPage.js
// UPDATED WITH ALL REQUIRED FIELDS
// =====================================

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
            vendor
            tags
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
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

/* SEARCH PRODUCTS QUERY - FOR SEARCH PAGE */
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    products(first: 50, query: $query) {
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
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;