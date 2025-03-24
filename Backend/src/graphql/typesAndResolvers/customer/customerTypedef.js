const { gql } = require("graphql-tag");

const customer_typedef = gql`
  type Customer {
    id: ID!
    phone: String!
    name: String
    address: String
    city: String
    location: String
    created_at: String
    user_id: ID
    longitude: Float
    latitude: Float
  }

  extend type Query {
    getCustomerDetails(userId: ID!): Customer
    getCustomerDetailsByUserid(userId: ID!): Customer
  }

  extend type Mutation {
    createCustomer(
      userId: ID!
      name: String!
      phone: String!
      address: String!
      city: String!
      latitude: Float
      longitude: Float
    ): Customer

    updateCustomerDetails(
      userId: ID!
      name: String
      phone: String
      address: String
      city: String
      latitude: Float
      longitude: Float
    ): Customer
  }
`;

module.exports = customer_typedef;
