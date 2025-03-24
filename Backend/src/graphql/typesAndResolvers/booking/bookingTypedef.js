const { gql } = require("graphql-tag");

const booking_typedef = gql`
  type Booking {
    id: ID!
    customer_id: ID!
    worker_id: ID!
    status: String!
    job_description: String!
    scheduled_time: String!
    completed_time: String
    payment_status: String!
    created_at: String!
  }

  type BookingForTable {
    id: ID!
    customer_id: ID!
    worker_id: ID!
    job_description: String!
    scheduled_time: String!
    status: String!
    worker: Worker!
  }

  extend type Query {
    getBookingByCustomerAndWorker(customer_id: ID!, worker_id: ID!): Booking
    getBookingsByCustomer(customer_id: ID!): [BookingForTable]
    getBookingsByWorker(worker_id: ID!): [Booking]
    getFilteredBookingsByWorker(worker_id: ID!, status: String!): [Booking]
  }

  extend type Mutation {
    createBooking(
      customer_id: ID!
      worker_id: ID!
      job_description: String!
      scheduled_time: String!
    ): Booking

    updateBookingStatus(id: ID!, status: String!): Booking
  }
`;

module.exports = booking_typedef;
