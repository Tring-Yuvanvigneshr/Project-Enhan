import gql from "graphql-tag";

export const GET_CUSTOMER_DETAILS = gql`
  query getCustomerDetails($userId: ID!) {
    getCustomerDetails(userId: $userId) {
      id
      name
      phone
      address
      city
    }
  }
`;
