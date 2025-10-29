import React from "react";
import { Card } from "../ui/card";

interface Booking {
  id: number;
  date: string;
  timeSlot: string;
  stationName: string;
  chargerType: string;
  powerOutput: string;
  locationName: string;
  city: string;
  address: string;
}

interface BookedSlotsListProps {
  bookedSlots: Booking[];
}

const BookedSlotsList: React.FC<BookedSlotsListProps> = ({ bookedSlots }) => {
  if (bookedSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No bookings yet.</p>
        <p className="text-sm mt-2">
          Select a location, station, and time to make your first booking!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {bookedSlots.map((booking) => (
        <Card key={booking.id} className="p-4 border border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{booking.stationName}</h3>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Confirmed
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span>{" "}
              {booking.locationName}, {booking.city}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {booking.address}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Charger:</span>{" "}
              {booking.chargerType} ({booking.powerOutput})
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <p className="text-sm font-medium">
                📅{" "}
                {new Date(booking.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm font-medium">🕐 {booking.timeSlot}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BookedSlotsList;
