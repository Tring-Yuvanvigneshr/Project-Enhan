const { gql } = require("graphql-tag");

const review_typedef = gql`
  type Review {
    id: ID!
    customer_id: ID!
    worker_id: ID!
    rating: Int!
    comment: String
    created_at: String
  }


  extend type Query {
    reviews: [Review]
    reviewsByWorker(worker_id: ID!): [Review]
    getReview(customer_id: ID!, worker_id: ID!): Review
  }

  extend type Mutation {
    addReview(
      customer_id: ID!
      worker_id: ID!
      rating: Int!
      comment: String!
    ): Review
  }
`;

module.exports = review_typedef;
