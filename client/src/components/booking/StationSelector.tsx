import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../api";
import { Card } from "../ui/card";

interface Station {
  id: number;
  name: string;
  charger_type: string;
  power_output: string;
}

interface StationSelectorProps {
  locationId: number;
  onStationSelect: (station: Station) => void;
}

const StationSelector: React.FC<StationSelectorProps> = ({
  locationId,
  onStationSelect,
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, [locationId]);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await bookingAPI.getStationsByLocation(locationId);
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (station: Station) => {
    setSelectedStation(station);
    onStationSelect(station);
  };

  if (loading) {
    return <div className="text-center py-4">Loading stations...</div>;
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No charging stations available at this location.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {stations.map((station) => (
        <Card
          key={station.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedStation?.id === station.id
              ? "border-2 border-blue-500 bg-blue-50"
              : "border border-gray-200"
          }`}
          onClick={() => handleSelect(station)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{station.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Type:</span>{" "}
                {station.charger_type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Power:</span>{" "}
                {station.power_output}
              </p>
            </div>
            {selectedStation?.id === station.id && (
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

export default StationSelector;
