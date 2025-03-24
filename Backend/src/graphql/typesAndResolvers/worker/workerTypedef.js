const { gql } = require("graphql-tag");

const worker_typedef = gql`
  type Worker {
    id: ID!
    phone: String!
    profession: String!
    experience: Int
    location: String
    is_available: String
    created_at: String
    name: String
    address: String
    city: String
    available_from: String
    available_to: String
    distance: String
  }

  type WorkerForWorker {
      id: ID!
      name: String!
      phone: String!
      profession: String!
      experience: Int!
      is_available: String
      available_from: String
      available_to: String
      customer_id: ID!
      city: String
      address: String
      latitude: Float
      longitude: Float
  }

  

  extend type Query {
    workers: [Worker]
    worker(id: ID!): Worker
    getNearbyWorkers(userId: ID!): [Worker]
    getAvailableWorkers: [Worker]
    workerForworker(id: ID!): WorkerForWorker
  }

  extend type Mutation {
    createWorker(
      userId: ID!
      phone: String!
      profession: String!
      experience: Int!
      aadhar_number: String!
      latitude: Float!
      longitude: Float!
      address: String!
      city: String!
      name: String!
      available_from: String!
      available_to: String!
    ): Worker

    updateWorkerDetails(
      userId: ID!
      name: String!
      phone: String!
      profession: String!
      experience: Int!
      address: String!
      city: String!
      latitude: Float!
      longitude: Float!
      available_from: String!
      available_to: String!
    ): Worker

    updateWorkerAvailability(is_available: String!, id: ID!): WorkerForWorker!
  }
`;

module.exports = worker_typedef;
