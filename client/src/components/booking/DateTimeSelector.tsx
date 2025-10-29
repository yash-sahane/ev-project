import React, { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

const DateTimeSelector: React.FC<{
  bookedSlots: string[];
  onSelect: (dateTime: string) => void;
}> = ({ bookedSlots, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const dateTime = `${dateString}T${selectedTime}`;
      if (!bookedSlots.includes(dateTime)) {
        onSelect(dateTime);
      } else {
        alert("This slot is already booked. Please select another time.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        className="rounded-md border"
      />
      <div className="w-full">
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Time:
        </label>
        <select
          id="time"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          onChange={(e) => handleTimeChange(e.target.value)}
          value={selectedTime || ""}
        >
          <option value="">-- Select Time --</option>
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, "0");
            return (
              <option key={i} value={`${hour}:00`}>
                {`${hour}:00`}
              </option>
            );
          })}
        </select>
      </div>
      <Button
        onClick={handleBooking}
        disabled={!selectedDate || !selectedTime}
        className="w-full"
      >
        Book Slot
      </Button>
    </div>
  );
};

export default DateTimeSelector;
