import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../api";
import { Card } from "../ui/card";
import { type Location } from "../../types";

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching locations...");
      const data = await bookingAPI.getLocations();
      console.log("Locations received:", data);
      setLocations(data);
    } catch (error: any) {
      console.error("Error fetching locations:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load locations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchLocations}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No locations available.</p>
        <button
          onClick={fetchLocations}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {locations.map((location) => (
        <Card
          key={location.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedLocation?.id === location.id
              ? "border-2 border-blue-500 bg-blue-50"
              : "border border-gray-200"
          }`}
          onClick={() => handleSelect(location)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{location.city}</p>
              <p className="text-sm text-gray-500">{location.address}</p>
            </div>
            {selectedLocation?.id === location.id && (
              <div className="bg-blue-500 text-white rounded-full p-1">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LocationSelector;
