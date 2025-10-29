export interface User {
  id: number;
  username: string;
}
export interface Location {
  id: number;
  name: string;
  city: string;
  address: string;
}

export interface Station {
  id: number;
  location_id: number;
  name: string;
  charger_type: string;
  power_output: string;
}

export interface Booking {
  id: number;
  user_id: number;
  station_id: number;
  date: string;
  time_slot: string;
  created_at: string;
}
