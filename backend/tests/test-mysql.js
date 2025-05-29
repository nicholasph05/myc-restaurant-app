const pool = require('../config/db');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Error al conectar:', error);
    process.exit(1);
  }
}

testConnection();