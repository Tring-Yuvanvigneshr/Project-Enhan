const { gql } = require("graphql-tag");
const user_typedef = require("./typesAndResolvers/user/userTypedef");
const customer_typedef = require("./typesAndResolvers/customer/customerTypedef");
const worker_typedef = require("./typesAndResolvers/worker/workerTypedef");
const review_typedef = require("./typesAndResolvers/review/reviewTypedef");
const booking_typedef = require("./typesAndResolvers/booking/bookingTypedef");

const baseType = gql`
  type Query
  type Mutation
`;

module.exports = [
  baseType,
  user_typedef,
  customer_typedef,
  worker_typedef,
  review_typedef,
  booking_typedef,
];
