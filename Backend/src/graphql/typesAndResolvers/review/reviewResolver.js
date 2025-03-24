const pool = require("../../../config/db")
const { authenticateUser, customerAuthorization } = require("../../../middleware/authMiddleware")

const review_resolvers = {
  Query: {
    reviews: async (_, __, req) => {

      try {
        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)

        const { rows } = await pool.query("SELECT * FROM reviews");
        return rows
      } catch (error) {
        throw new Error(error.message);
      }
    },

    reviewsByWorker: async (_, { worker_id }, req) => {

      try {
        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)

        const { rows } = await pool.query(`
                SELECT 
                  id,
                  customer_id,
                  worker_id,
                  rating,
                  comment,
                  created_at
                FROM reviews
                WHERE worker_id = $1
              `, [worker_id]);

        return rows;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getReview: async (_, { customer_id, worker_id }, req) => {    // in progress

      try {
        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)

        const { rows } = await pool.query(
          `SELECT id, rating, comment 
                 FROM reviews 
                 WHERE customer_id = $1 AND worker_id = $2`,
          [customer_id, worker_id]
        );

        return rows[0] || null;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    addReview: async (_, { customer_id, worker_id, rating, comment }, req) => {

      try {
        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)

        const newReview = await pool.query(
          `INSERT INTO reviews (customer_id, worker_id, rating, comment) 
                   VALUES ($1, $2, $3, $4) 
                   RETURNING *`,
          [customer_id, worker_id, rating, comment]
        );

        return newReview.rows[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },
  }
}

module.exports = review_resolvers