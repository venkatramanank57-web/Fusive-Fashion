import { gql } from "@apollo/client";

export const GET_BESTSELLERS = gql`
  query GetBestsellers {
    collection(handle: "bestseller") {
      title
      products(first: 50) {
        edges {
          node {
            id
            title
            handle

            featuredImage {
              url(
                transform: {
                  maxWidth: 1539
                  maxHeight: 2310
                  crop: CENTER
                  preferredContentType: WEBP
                }
              )
              altText
            }

            images(first: 5) {
              edges {
                node {
                  url(
                    transform: {
                      maxWidth: 1539
                      maxHeight: 2310
                      crop: CENTER
                      preferredContentType: WEBP
                    }
                  )
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
                    url(
                      transform: {
                        maxWidth: 1539
                        maxHeight: 2310
                        crop: CENTER
                        preferredContentType: WEBP
                      }
                    )
                    altText
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
