// =====================================
// src/api/shopify/customer.js
// Shopify Storefront Customer API
// =====================================

import { gql } from "@apollo/client";

/* ======================================================
   1️⃣ CUSTOMER LOGIN
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
   2️⃣ CUSTOMER REGISTER
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
   3️⃣ GET CUSTOMER PROFILE + ADDRESS BOOK
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
      firstName
      lastName
      company
      address1
      address2
      city
      province
      country
      zip
      phone
    }

    addresses(first: 20) {
      edges {
        node {
          id
          firstName
          lastName
          company
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
   4️⃣ GET CUSTOMER ORDERS
   ====================================================== */
export const GET_CUSTOMER_ORDERS = gql`
query GetCustomerOrders($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          statusUrl

          totalPrice {
            amount
            currencyCode
          }

          lineItems(first: 10) {
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
   5️⃣ UPDATE CUSTOMER PROFILE
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
   6️⃣ ADD NEW ADDRESS
   ====================================================== */
export const ADD_CUSTOMER_ADDRESS = gql`
mutation AddCustomerAddress(
  $customerAccessToken: String!
  $address: MailingAddressInput!
) {
  customerAddressCreate(
    customerAccessToken: $customerAccessToken
    address: $address
  ) {
    customerAddress {
      id
      firstName
      lastName
      company
      address1
      address2
      city
      province
      country
      zip
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

/* ======================================================
   7️⃣ UPDATE ADDRESS
   ====================================================== */
export const UPDATE_CUSTOMER_ADDRESS = gql`
mutation UpdateCustomerAddress(
  $customerAccessToken: String!
  $id: ID!
  $address: MailingAddressInput!
) {
  customerAddressUpdate(
    customerAccessToken: $customerAccessToken
    id: $id
    address: $address
  ) {
    customerAddress {
      id
      firstName
      lastName
      company
      address1
      address2
      city
      province
      country
      zip
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

/* ======================================================
   8️⃣ DELETE ADDRESS
   ====================================================== */
export const DELETE_CUSTOMER_ADDRESS = gql`
mutation DeleteCustomerAddress(
  $customerAccessToken: String!
  $id: ID!
) {
  customerAddressDelete(
    customerAccessToken: $customerAccessToken
    id: $id
  ) {
    deletedCustomerAddressId
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

/* ======================================================
   9️⃣ REQUEST PASSWORD RESET
   ====================================================== */
export const UPDATE_CUSTOMER_PASSWORD = gql`
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/* ======================================================
   🔟 CUSTOMER LOGOUT
   ====================================================== */
export const CUSTOMER_LOGOUT = gql`
mutation CustomerLogout($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors {
      field
      message
    }
  }
}
`;
