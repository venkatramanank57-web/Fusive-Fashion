// src/api/shopify/policies.js
import { gql } from "@apollo/client";

export const GET_SHOP_POLICIES = gql`
  query GetShopPolicies {
    shop {
      name
      primaryDomain {
        url
      }
      privacyPolicy {
        title
        body
      }
      refundPolicy {
        title
        body
      }
      termsOfService {
        title
        body
      }
      shippingPolicy {
        title
        body
      }
    }
  }
`;