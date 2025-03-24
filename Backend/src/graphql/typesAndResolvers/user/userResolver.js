const pool = require("../../../config/db");
const { hashPassword, verifyPassword, generateToken } = require("../../../auth/auth");
const { authenticateUser } = require("../../../middleware/authMiddleware")

const userresolvers = {
  Query: {},

  Mutation: {
    registerUser: async (_, { email, password, role }) => {
      const hashedPassword = await hashPassword(password);

      const result = await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
        [email, hashedPassword, role]
      );

      const user = result.rows[0];

      return user;
    },

    signIn: async (_, { email, password }) => {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      const user = result.rows[0];

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      };
    },

    hardDeleteUser: async (_, { id }, req) => {
      try {

        authenticateUser(req.headers.authorization)

        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount > 0;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
      }
    }
  },
};

module.exports = userresolvers;
