import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Platform, Alert } from "react-native";
import Constants from "expo-constants";
import {
    SensorDevice,
    SensorService,
    SensorSummary,
} from "../services/sensors";

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Mock notifications for Expo Go, real ones for dev build
let Notifications: any = {
    scheduleNotificationAsync: async () => {
        if (isExpoGo) {
            // Fallback to Alert for Expo Go
            console.log('[Notification would show]: Alert message');
        }
        return { status: 'success' };
    },
    setNotificationHandler: () => {},
    getPermissionsAsync: async () => ({ status: 'undetermined' }),
    requestPermissionsAsync: async () => ({ status: 'granted' }),
    addNotificationReceivedListener: () => ({ remove: () => {} }),
    addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
};

// Only try to import real notifications if NOT in Expo Go
if (!isExpoGo) {
    try {
        // Dynamic import for production/dev build
        const realNotifications = require('expo-notifications');
        Notifications = { ...Notifications, ...realNotifications };
        
        // Configure notifications for non-Expo Go environments
        if (realNotifications.setNotificationHandler) {
            realNotifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                }),
            });
        }
    } catch (error) {
        console.log('expo-notifications module not available, using fallback');
    }
}

interface SensorContextType {
  sensors: SensorDevice[];
  sensorSummary: SensorSummary | null;
  loading: boolean;
  error: string | null;
  hasActiveSensors: boolean;
  refreshSensors: () => Promise<void>;
  refreshSensorsSummary: () => Promise<void>;
  addSensor: (sensorData: Partial<SensorDevice>) => Promise<SensorDevice>;
  updateSensor: (
    id: number,
    sensorData: Partial<SensorDevice>,
  ) => Promise<void>;
  deleteSensor: (id: number) => Promise<void>;
  addSensorReading: (id: number, value: number) => Promise<void>;
}

export const SensorContext = createContext<SensorContextType | undefined>(
  undefined,
);

interface SensorProviderProps {
  children: ReactNode;
}

export const SensorProvider: React.FC<SensorProviderProps> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorDevice[]>([]);
  const [sensorSummary, setSensorSummary] = useState<SensorSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSensors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SensorService.getSensors();
      setSensors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sensors");
      setSensors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSensorsSummary = useCallback(async () => {
    try {
      const summary = await SensorService.getSensorsSummary();
      setSensorSummary(summary);

      // Check for alerts and send notifications
      if (summary.active_alerts) {
        Object.values(summary.active_alerts).forEach((sensorAlerts) => {
          sensorAlerts.alerts.forEach((alert) => {
            if (alert.severity === "critical") {
              scheduleAlert(alert.message);
            }
          });
        });
      }
    } catch (err) {
      console.error("Error fetching sensors summary:", err);
    }
  }, []);

  const addSensor = useCallback(
    async (sensorData: Partial<SensorDevice>): Promise<SensorDevice> => {
      try {
        const newSensor = await SensorService.createSensor(sensorData);
        setSensors([...sensors, newSensor]);
        return newSensor;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add sensor";
        setError(message);
        throw err;
      }
    },
    [sensors],
  );

  const updateSensor = useCallback(
    async (id: number, sensorData: Partial<SensorDevice>) => {
      try {
        await SensorService.updateSensor(id, sensorData);
        setSensors(
          sensors.map((s) => (s.id === id ? { ...s, ...sensorData } : s)),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update sensor";
        setError(message);
        throw err;
      }
    },
    [sensors],
  );

  const deleteSensor = useCallback(
    async (id: number) => {
      try {
        await SensorService.deleteSensor(id);
        setSensors(sensors.filter((s) => s.id !== id));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete sensor";
        setError(message);
        throw err;
      }
    },
    [sensors],
  );

  const addSensorReading = useCallback(
    async (id: number, value: number) => {
      try {
        await SensorService.addReading(id, value);
        // Refresh summary to get latest data
        await refreshSensorsSummary();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add reading";
        setError(message);
        throw err;
      }
    },
    [refreshSensorsSummary],
  );

  const scheduleAlert = useCallback(async (message: string) => {
    try {
      if (isExpoGo) {
        // Use Alert instead of notifications in Expo Go
        Alert.alert(
          "Farm Alert",
          message,
          [{ text: "OK", style: "default" }],
          { cancelable: false }
        );
        console.log("Critical alert (Expo Go fallback):", message);
        return;
      }

      // Real notification for dev build/production
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Farm Alert",
          body: message,
          sound: "default",
          priority: "high",
        },
        trigger: {
          seconds: 1,
          repeats: false,
        },
      });
    } catch (err) {
      console.error("Failed to schedule notification:", err);
      // Fallback to Alert if notification fails
      Alert.alert("Farm Alert", message);
    }
  }, []);

  // Auto-refresh summaries every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSensorsSummary();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshSensorsSummary]);

  // Initial load
  useEffect(() => {
    refreshSensors();
    refreshSensorsSummary();
  }, [refreshSensors, refreshSensorsSummary]);

  const hasActiveSensors = sensors.some((s) => s.is_active);

  const value: SensorContextType = {
    sensors,
    sensorSummary,
    loading,
    error,
    hasActiveSensors,
    refreshSensors,
    refreshSensorsSummary,
    addSensor,
    updateSensor,
    deleteSensor,
    addSensorReading,
  };

  return (
    <SensorContext.Provider value={value}>{children}</SensorContext.Provider>
  );
};

export const useSensors = (): SensorContextType => {
  const context = React.useContext(SensorContext);
  if (!context) {
    throw new Error("useSensors must be used within a SensorProvider");
  }
  return context;
};