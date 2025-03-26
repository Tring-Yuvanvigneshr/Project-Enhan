import gql from "graphql-tag";

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $userId: ID!
    $phone: String!
    $address: String!
    $city: String!
    $latitude: Float
    $longitude: Float
    $name: String!
  ) {
    createCustomer(
      userId: $userId
      phone: $phone,
      address: $address
      city: $city
      latitude: $latitude
      longitude: $longitude
      name: $name
    ) {
      id
      name
      phone
      address
      city
      created_at
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomerDetails(
    $userId: ID!
    $name: String
    $phone: String
    $address: String
    $city: String
    $latitude: Float
    $longitude: Float
  ) {
    updateCustomerDetails(
      userId: $userId
      name: $name
      phone: $phone
      address: $address
      city: $city
      latitude: $latitude
      longitude: $longitude
    ) {
      id
      name
      phone
      address
      city
      location
    }
  }
`;