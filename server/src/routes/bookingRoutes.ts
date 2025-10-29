import express from "express";
import {
  getLocations,
  getStationsByLocation,
  getBookedSlots,
  createBooking,
  getUserBookings,
} from "../controllers/bookingController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/locations", authenticate, getLocations);
router.get("/stations/:locationId", authenticate, getStationsByLocation);
router.get("/slots/:stationId/:date", authenticate, getBookedSlots);
router.post("/", authenticate, createBooking);
router.get("/user", authenticate, getUserBookings);

export default router;
