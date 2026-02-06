// =====================================
// src/api/shopify/policies.js
// UPDATED WITH WORKING QUERIES
// =====================================

import { gql } from "@apollo/client";

// TEST QUERY - Minimal fields first
export const TEST_POLICIES = gql`
  query GetShopPolicies {
    shop {
      name
      primaryDomain {
        url
      }
      # Try getting just ONE policy first
      privacyPolicy {
        title
        body
      }
    }
  }
`;

// UPDATED - Use simpler fields that definitely work
export const GET_SHOP_POLICIES = gql`
  query GetShopPolicies {
    shop {
      name
      privacyPolicy {
        title
        body
        handle
      }
      refundPolicy {
        title
        body
        handle
      }
      termsOfService {
        title
        body
        handle
      }
      shippingPolicy {
        title
        body
        handle
      }
    }
  }
`;

// Get shop contact - SIMPLIFIED
export const GET_SHOP_CONTACT = gql`
  query GetShopContact {
    shop {
      name
      email
      primaryDomain {
        url
      }
    }
  }
`;