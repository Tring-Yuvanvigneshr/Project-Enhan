const userResolvers = require("./typesAndResolvers/user/userResolver");
const customerResolvers = require("./typesAndResolvers/customer/customerResolver");
const workerResolvers = require("./typesAndResolvers/worker/workerResolver");
const bookingResolvers = require("./typesAndResolvers/booking/bookingResolver");
const reviewResolvers = require("./typesAndResolvers/review/reviewResolver");

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...customerResolvers.Query,
    ...workerResolvers.Query,
    ...bookingResolvers.Query,
    ...reviewResolvers.Query
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...customerResolvers.Mutation,
    ...workerResolvers.Mutation,
    ...bookingResolvers.Mutation,
    ...reviewResolvers.Mutation
  }
};

module.exports = resolvers;
