import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../components/booking/LocationSelector";
import StationSelector from "../components/booking/StationSelector";
import DateTimeSelector from "../components/booking/DateTimeSelector";
import BookedSlotsList from "../components/booking/BookedSlotsList";
import { bookingAPI } from "../api";
import { type Location, type Station } from "../types";
import { toast } from "sonner";

const Home: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchUserBookings();
  }, [navigate]);

  useEffect(() => {
    if (selectedStation && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedStation, selectedDate]);

  const fetchBookedSlots = async () => {
    if (selectedStation && selectedDate) {
      try {
        const slots = await bookingAPI.getBookedSlots(
          selectedStation.id,
          selectedDate
        );
        setBookedSlots(
          slots.map((slot: any) => `${slot.date}T${slot.timeSlot}`)
        );
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        toast.error("Failed to load booked slots");
      }
    }
  };

  const fetchUserBookings = async () => {
    try {
      const bookings = await bookingAPI.getUserBookings();
      setUserBookings(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Failed to load your bookings");
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSelectedStation(null);
    toast.success(`Selected location: ${location.name}`);
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    toast.success(`Selected station: ${station.name}`);
  };

  const handleDateTimeSelect = async (dateTime: string) => {
    if (!selectedStation) {
      toast.error("Please select a charging station first");
      return;
    }

    const [date, time] = dateTime.split("T");
    setSelectedDate(date);

    // Show loading toast
    const loadingToast = toast.loading("Processing your booking...");

    try {
      await bookingAPI.createBooking({
        stationId: selectedStation.id,
        date,
        timeSlot: time,
      });

      toast.dismiss(loadingToast);
      toast.success("Booking confirmed!", {
        description: `${selectedStation.name} on ${new Date(
          date
        ).toLocaleDateString()} at ${time}`,
      });

      fetchBookedSlots();
      fetchUserBookings();
    } catch (error: any) {
      toast.dismiss(loadingToast);

      const errorMessage = error.response?.data?.message;

      if (errorMessage === "This slot is already booked") {
        toast.error("Slot Already Booked", {
          description:
            "This time slot has been taken by another user. Please select a different time.",
        });
      } else if (error.response?.status === 401) {
        toast.error("Session Expired", {
          description: "Please log in again to continue.",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Booking Failed", {
          description:
            errorMessage ||
            "An error occurred while processing your booking. Please try again.",
        });
      }

      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Location</h2>
              <LocationSelector onLocationSelect={handleLocationSelect} />
            </div>

            {selectedLocation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Select Charging Station
                </h2>
                <StationSelector
                  locationId={selectedLocation.id}
                  onStationSelect={handleStationSelect}
                />
              </div>
            )}

            {selectedStation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Select Date & Time
                </h2>
                <DateTimeSelector
                  bookedSlots={bookedSlots}
                  onSelect={handleDateTimeSelect}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            <BookedSlotsList bookedSlots={userBookings} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
