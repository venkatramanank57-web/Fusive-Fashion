// =====================================
// src/api/shopify/customer.js
// PURPOSE:
// Shopify Storefront Customer GraphQL operations
// - Authentication (login, register, logout)
// - Profile management
// - Orders
// - Password recovery
// =====================================

import { gql } from "@apollo/client";

/* ======================================================
   1. CUSTOMER LOGIN
   ====================================================== */
export const CUSTOMER_LOGIN = gql`
  mutation CustomerLogin($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

/* ======================================================
   2. CUSTOMER REGISTRATION
   IMPORTANT:
   Shopify does NOT return accessToken here.
   You must call CUSTOMER_LOGIN after successful register.
   ====================================================== */
export const CUSTOMER_REGISTER = gql`
  mutation CustomerRegister($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        acceptsMarketing
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

/* ======================================================
   3. GET CUSTOMER PROFILE
   ====================================================== */
export const GET_CUSTOMER_PROFILE = gql`
  query GetCustomerProfile($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      createdAt

      defaultAddress {
        id
        name
        address1
        address2
        city
        province
        country
        zip
        phone
      }

      addresses(first: 10) {
        edges {
          node {
            id
            name
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
    }
  }
`;

/* ======================================================
   4. GET CUSTOMER ORDERS
   ====================================================== */
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus

            totalPrice {
              amount
              currencyCode
            }

            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                    }
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

/* ======================================================
   5. UPDATE CUSTOMER PROFILE
   ====================================================== */
export const UPDATE_CUSTOMER_PROFILE = gql`
  mutation UpdateCustomer(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

/* ======================================================
   6. REQUEST PASSWORD RESET
   NOTE:
   This sends reset email.
   It does NOT change password directly.
   ====================================================== */
export const REQUEST_PASSWORD_RESET = gql`
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
      }
    }
  }
`;

/* ======================================================
   7. CUSTOMER LOGOUT
   ====================================================== */
export const CUSTOMER_LOGOUT = gql`
  mutation CustomerLogout($customerAccessToken: String!) {
    customerAccessTokenDelete(
      customerAccessToken: $customerAccessToken
    ) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;
