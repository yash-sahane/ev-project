import { Request, Response } from "express";
import pool from "../config/database";

export const getLocations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM locations ORDER BY city, name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStationsByLocation = async (req: Request, res: Response) => {
  const { locationId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM charging_stations WHERE location_id = $1 ORDER BY name",
      [locationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching charging stations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookedSlots = async (req: Request, res: Response) => {
  const { stationId, date } = req.params;

  try {
    const result = await pool.query(
      'SELECT date, time_slot as "timeSlot" FROM bookings WHERE station_id = $1 AND date = $2',
      [stationId, date]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { stationId, date, timeSlot } = req.body;
  const userId = (req as any).user.userId;

  try {
    // Check if slot is already booked
    const existingBooking = await pool.query(
      "SELECT * FROM bookings WHERE station_id = $1 AND date = $2 AND time_slot = $3",
      [stationId, date, timeSlot]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Create booking
    const result = await pool.query(
      "INSERT INTO bookings (user_id, station_id, date, time_slot) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, stationId, date, timeSlot]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const result = await pool.query(
      `SELECT b.id, b.date, b.time_slot as "timeSlot", 
              cs.name as "stationName", cs.charger_type as "chargerType", 
              cs.power_output as "powerOutput",
              l.name as "locationName", l.city, l.address
       FROM bookings b
       JOIN charging_stations cs ON b.station_id = cs.id
       JOIN locations l ON cs.location_id = l.id
       WHERE b.user_id = $1
       ORDER BY b.date DESC, b.time_slot DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
