const pool = require("../../../config/db")
const { authenticateUser, customerAuthorization, workerAuthorization } = require("../../../middleware/authMiddleware")

const worker_resolvers = {
  Query: {
    workers: async (_, __, req) => {
      try {

        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)
        const { rows } = await pool.query(`
          SELECT 
            id, 
            phone, 
            profession, 
            experience, 
            location, 
            is_available, 
            available_from, 
            available_to, 
            created_at, 
            name
            FROM workers 
        `);
        return rows;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    worker: async (_, { id }, req) => {

      try {

        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)
        const { rows } = await pool.query(`
          SELECT 
            id, 
            name, 
            phone,
            location,
            profession, 
            experience, 
            is_available, 
            available_from, 
            available_to
          FROM workers
          WHERE id = $1
        `, [id]);

        return rows[0];

      } catch (error) {
        throw new Error(error.message);
      }
    },


    getNearbyWorkers: async (_, { userId }, req) => {

      try {
        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)

        const query = `
        SELECT 
            w.id AS worker_id,
            w.name,
            w.address,
            w.phone,
            w.profession,
            w.experience,
            w.is_available,
            w.city,
            w.aadhar,
            w.available_from,
            w.available_to,
            ST_Distance(c.location, w.location) AS distance
        FROM 
            customers c
        JOIN 
            workers w ON c.location IS NOT NULL
        WHERE 
            c.user_id = $1
        ORDER BY 
            distance ASC
      `;
        const { rows } = await pool.query(query, [userId]);
        return rows.map(row => ({
          id: row.worker_id,
          name: row.name,
          address: row.address,
          phone: row.phone,
          profession: row.profession,
          experience: row.experience,
          is_available: row.is_available,
          city: row.city,
          aadhar: row.aadhar,
          available_from: row.available_from,
          available_to: row.available_to,
          distance: row.distance
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getAvailableWorkers: async (_, __, req) => {
      try {

        const user = authenticateUser(req.headers.authorization)
        customerAuthorization(user)
        const { rows } = await pool.query(`
          SELECT 
            id, 
            name, 
            phone, 
            profession, 
            experience, 
            is_available, 
            available_from, 
            available_to, 
            location, 
            address, 
            city
          FROM workers
          WHERE is_available = 'available';
        `);
        return rows;
      } catch (error) {
        throw new Error(error.message);
      }
    },


    // for worker

    workerForworker: async (_, { id }, req) => {
      try {

        const user = authenticateUser(req.headers.authorization)
        workerAuthorization(user)

        const { rows } = await pool.query(`
          SELECT 
            id, 
            name, 
            phone,
            profession, 
            experience, 
            is_available, 
            available_from, 
            available_to,
            city,
            address,
            ST_X(location::geometry) AS longitude, 
            ST_Y(location::geometry) AS latitude
          FROM workers
          WHERE user_id = $1
        `, [id]);

        return rows[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },


  Mutation: {
    createWorker: async (_, { userId, phone, profession, experience, aadhar_number, latitude, longitude, address, city, name, available_from, available_to }, req) => {
      try {

        const user = authenticateUser(req.headers.authorization)
        workerAuthorization(user)

        const result = await pool.query(
          `INSERT INTO workers (
            user_id, phone, profession, experience, aadhar, location, address, city, name, available_from, available_to
          ) VALUES (
            $1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, $9, $10, $11, $12
          ) RETURNING *`,
          [userId, phone, profession, experience, aadhar_number, longitude, latitude, address, city, name, available_from, available_to]
        );

        return result.rows[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // for worker

    updateWorkerAvailability: async (_, { is_available, id }, req) => {
      try {
        const user = authenticateUser(req.headers.authorization)
        workerAuthorization(user)
        const result = await pool.query(
          `UPDATE workers
            SET is_available = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *;
          `, [is_available, id]);

        return result.rows[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateWorkerDetails: async (_, { name, phone, profession, experience, address, latitude, longitude, city, available_from, available_to, userId }, req) => {
      try {
        const user = authenticateUser(req.headers.authorization)
        workerAuthorization(user)

        const result = await pool.query(
          `UPDATE workers
            SET
              name=$1,
              phone=$2,
              profession=$3,
              experience=$4,
              address=$5,
              location = ST_SetSRID(ST_MakePoint($7, $6), 4326),
              city=$8,
              available_from = $9,
              available_to = $10,
              updated_at = now()
              WHERE user_id = $11
              RETURNING *
            `, [name, phone, profession, experience, address, latitude, longitude, city, available_from, available_to, userId]
        )

        return result.rows[0];
      }
      catch (e) {
            throw new Error(e.message);
      }
    }
  }
};

module.exports = worker_resolvers;
