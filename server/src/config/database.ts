import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ev_charging",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT) || 5432,
});

const createTables = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Locations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Charging Stations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS charging_stations (
        id SERIAL PRIMARY KEY,
        location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        charger_type VARCHAR(100) NOT NULL,
        power_output VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        station_id INTEGER REFERENCES charging_stations(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time_slot VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(station_id, date, time_slot)
      )
    `);

    // Insert sample locations
    await pool.query(`
      INSERT INTO locations (name, city, address) VALUES
        ('Downtown Hub', 'New York', '123 Main St, Downtown'),
        ('Mall Station', 'Los Angeles', '456 Shopping Blvd, Mall Area'),
        ('Airport Terminal', 'Chicago', '789 Airport Rd, Terminal 1'),
        ('Business Park', 'Houston', '321 Corporate Ave, Business District')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample charging stations
    await pool.query(`
      INSERT INTO charging_stations (location_id, name, charger_type, power_output) VALUES
        (1, 'Station A1', 'Type 2 AC', '22 kW'),
        (1, 'Station A2', 'CCS DC', '50 kW'),
        (1, 'Station A3', 'CHAdeMO', '50 kW'),
        (2, 'Station B1', 'Type 2 AC', '22 kW'),
        (2, 'Station B2', 'CCS DC', '150 kW'),
        (3, 'Station C1', 'Type 2 AC', '11 kW'),
        (3, 'Station C2', 'CCS DC', '350 kW'),
        (4, 'Station D1', 'Type 2 AC', '22 kW'),
        (4, 'Station D2', 'CCS DC', '50 kW')
      ON CONFLICT DO NOTHING
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connected successfully");
    await createTables();
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});

export { pool, connectDB };
export default pool;
