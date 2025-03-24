import gql from 'graphql-tag'

export const CREATE_WORKER = gql`
  mutation CreateWorker(
    $userId: ID!
    $name: String!
    $phone: String!
    $profession: String!
    $experience: Int!
    $aadhar_number: String!
    $latitude: Float!
    $longitude: Float!
    $address: String!
    $city: String!
    $available_from: String!
    $available_to: String!
  ) {
    createWorker(
      userId: $userId
      name: $name
      phone: $phone
      profession: $profession
      experience: $experience
      aadhar_number: $aadhar_number
      latitude: $latitude
      longitude: $longitude
      address: $address
      city: $city
      available_from: $available_from
      available_to: $available_to
    ) {
      id
      name
      phone
      profession
    }
  }
`;

export const UPDATE_WORKER_DETAILS = gql`
  mutation UpdateWorkerDetails(
    $name: String!
    $phone: String!
    $profession: String!
    $experience: Int!
    $address: String!
    $latitude: Float!
    $longitude: Float!
    $city: String!
    $available_from: String!
    $available_to: String!
    $userId: ID!
  ) {
    updateWorkerDetails(
      name: $name
      phone: $phone
      profession: $profession
      experience: $experience
      address: $address
      latitude: $latitude
      longitude: $longitude
      city: $city
      available_from: $available_from
      available_to: $available_to
      userId: $userId
    ) {
      id
      name
      phone
      profession
      experience
      address
      city
      available_from
      available_to
    }
  }
`;


