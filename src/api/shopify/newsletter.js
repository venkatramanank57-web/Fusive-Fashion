import { gql } from "@apollo/client";

export const NEWSLETTER_SUBSCRIBE = gql`
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
    }
    userErrors {
      field
      message
    }
  }
}
`;
