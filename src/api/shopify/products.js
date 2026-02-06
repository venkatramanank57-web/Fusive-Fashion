import { gql } from "@apollo/client";


//get all products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 102) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url(transform: { maxWidth: 1539, maxHeight: 2310, crop: CENTER, preferredContentType: WEBP })
            altText
          }
          images(first: 5) {
            edges {
              node {
                url(transform: { maxWidth: 1539, maxHeight: 2310, crop: CENTER, preferredContentType: WEBP })
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
                selectedOptions {
                  name
                  value
                }
                image {
                  url(transform: { maxWidth: 1539, maxHeight: 2310, crop: CENTER, preferredContentType: WEBP })
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;


// get single product all details 
export const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      
      options {
        id
        name
        values
      }
      
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      
      featuredImage {
        url
        altText
      }
      
      media(first: 10) {
        edges {
          node {
            mediaContentType
            alt
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Video {
              sources {
                url
                mimeType
              }
              previewImage {
                url
              }
            }
            ... on ExternalVideo {
              embedUrl
              host
            }
          }
        }
      }
      
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;