const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function withTransaction(callback) {
  const connection = await pool.getConnection();
  let isTransactionActive = false;
  try {
    await connection.beginTransaction();
    isTransactionActive = true;
    const result = await callback(connection);
    await connection.commit();
    isTransactionActive = false;
    return result;
  } catch (error) {
    if (isTransactionActive) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Failed to rollback transaction:", rollbackError);
      }
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { pool, query, withTransaction };
