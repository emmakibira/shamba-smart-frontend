import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "./api";

export interface SensorDevice {
  id: number;
  name: string;
  device_id: string;
  sensor_type: string;
  status: "active" | "inactive" | "disconnected" | "error";
  location_name: string;
  battery_level: number;
  unit: string;
  latest_reading?: {
    value: number;
    timestamp: string;
    unit: string;
  };
  active_alerts_count: number;
  is_active: boolean;
  min_threshold?: number;
  max_threshold?: number;
}

export interface SensorReading {
  id: number;
  value: number;
  timestamp: string;
  is_anomaly: boolean;
}

export interface SensorAlert {
  id: number;
  severity: "info" | "warning" | "critical";
  message: string;
  threshold_exceeded: "min" | "max";
  expected_value: number;
  actual_value: number;
  is_resolved: boolean;
  created_at: string;
}

export interface SensorSummary {
  total_sensors: number;
  active_sensors: number;
  inactive_sensors: number;
  error_sensors: number;
  recent_readings: {
    [key: number]: {
      sensor_name: string;
      value: number | null;
      timestamp: string | null;
      unit: string;
    };
  };
  active_alerts: {
    [key: number]: {
      count: number;
      alerts: SensorAlert[];
    };
  };
}

const sensorAPI = axios.create({
  baseURL: `${API_BASE_URL}/farm`,
  withCredentials: true,
});

// Add auth token to requests
sensorAPI.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const SensorService = {
  // Get all sensors
  getSensors: async (): Promise<SensorDevice[]> => {
    try {
      const response = await sensorAPI.get("/sensors/");
      return response.data.results || response.data;
    } catch (error) {
      console.error("Error fetching sensors:", error);
      throw error;
    }
  },

  // Get single sensor with full details
  getSensor: async (sensorId: number): Promise<SensorDevice> => {
    try {
      const response = await sensorAPI.get(`/sensors/${sensorId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Create new sensor
  createSensor: async (
    sensorData: Partial<SensorDevice>,
  ): Promise<SensorDevice> => {
    try {
      const response = await sensorAPI.post("/sensors/", sensorData);
      return response.data;
    } catch (error) {
      console.error("Error creating sensor:", error);
      throw error;
    }
  },

  // Update sensor
  updateSensor: async (
    sensorId: number,
    sensorData: Partial<SensorDevice>,
  ): Promise<SensorDevice> => {
    try {
      const response = await sensorAPI.patch(
        `/sensors/${sensorId}/`,
        sensorData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Delete sensor
  deleteSensor: async (sensorId: number): Promise<void> => {
    try {
      await sensorAPI.delete(`/sensors/${sensorId}/`);
    } catch (error) {
      console.error(`Error deleting sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Add sensor reading
  addReading: async (
    sensorId: number,
    value: number,
  ): Promise<SensorReading> => {
    try {
      const response = await sensorAPI.post(
        `/sensors/${sensorId}/readings/add/`,
        { value },
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding reading to sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Get sensor readings
  getReadings: async (
    sensorId: number,
    hours: number = 24,
  ): Promise<{
    sensor_id: number;
    sensor_name: string;
    unit: string;
    readings_count: number;
    readings: SensorReading[];
  }> => {
    try {
      const response = await sensorAPI.get(`/sensors/${sensorId}/readings/`, {
        params: { hours },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching readings for sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Get sensor alerts
  getAlerts: async (
    sensorId: number,
  ): Promise<{
    sensor_id: number;
    sensor_name: string;
    active_alerts_count: number;
    alerts: SensorAlert[];
  }> => {
    try {
      const response = await sensorAPI.get(`/sensors/${sensorId}/alerts/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alerts for sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // Get all sensors summary
  getSensorsSummary: async (): Promise<SensorSummary> => {
    try {
      const response = await sensorAPI.get("/sensors-summary/");
      return response.data;
    } catch (error) {
      console.error("Error fetching sensors summary:", error);
      throw error;
    }
  },

  // Get weather forecast
  getWeatherForecast: async (
    days: number = 5,
  ): Promise<{
    location: {
      latitude: number;
      longitude: number;
    };
    forecast_count: number;
    forecast: Array<{
      date: string;
      temp_min: number;
      temp_max: number;
      humidity: number;
      description: string;
      rainfall_probability: number;
    }>;
  }> => {
    try {
      const response = await sensorAPI.get("/weather-forecast/", {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      throw error;
    }
  },
};

export default SensorService;
