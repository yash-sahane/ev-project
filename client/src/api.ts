import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  signup: async (username: string, password: string) => {
    const response = await api.post("/auth/signup", { username, password });
    return response.data;
  },
};

// Booking APIs
export const bookingAPI = {
  getLocations: async () => {
    const response = await api.get("/bookings/locations");
    return response.data;
  },

  getStationsByLocation: async (locationId: number) => {
    const response = await api.get(`/bookings/stations/${locationId}`);
    return response.data;
  },

  getBookedSlots: async (stationId: number, date: string) => {
    const response = await api.get(`/bookings/slots/${stationId}/${date}`);
    return response.data;
  },

  createBooking: async (bookingData: {
    stationId: number;
    date: string;
    timeSlot: string;
  }) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get("/bookings/user");
    return response.data;
  },
};

export default api;
