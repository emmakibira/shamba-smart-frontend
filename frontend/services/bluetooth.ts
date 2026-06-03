import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device, Subscription } from "react-native-ble-plx";

const bleManager = new BleManager();

export interface BluetoothSensor {
  id: string;
  name: string;
  localName?: string | null;
  rssi?: number | null;
  manufacturerData?: string;
}

export interface PairedSensor {
  id: string;
  name: string;
  sensorType: string;
  location?: string;
}

const SENSOR_TYPES = [
  { type: "temperature", name: "Temperature Sensor", characteristic: "TEM" },
  { type: "humidity", name: "Humidity Sensor", characteristic: "HUM" },
  {
    type: "soil_moisture",
    name: "Soil Moisture Sensor",
    characteristic: "MOIS",
  },
  { type: "soil_ph", name: "Soil pH Sensor", characteristic: "PH" },
  { type: "light", name: "Light Intensity Sensor", characteristic: "LIGHT" },
  { type: "rain", name: "Rain Gauge Sensor", characteristic: "RAIN" },
  { type: "wind", name: "Wind Speed Sensor", characteristic: "WIND" },
];

class BluetoothSensorManager {
  private devices: Map<string, Device> = new Map();
  private isScanning = false;

  /**
   * Request Bluetooth permissions (Android 12+)
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === "android") {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const permissionResults =
          await PermissionsAndroid.requestMultiple(permissions);

        return Object.values(permissionResults).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED,
        );
      } else if (Platform.OS === "ios") {
        // iOS permissions are handled differently
        return true;
      }
      return true;
    } catch (error) {
      console.error("Error requesting Bluetooth permissions:", error);
      return false;
    }
  }

  /**
   * Start scanning for Bluetooth devices
   */
  async startScan(): Promise<BluetoothSensor[]> {
    try {
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error("Bluetooth permissions not granted");
      }

      this.devices.clear();
      const discoveredDevices: BluetoothSensor[] = [];
      this.isScanning = true;

      return new Promise((resolve, reject) => {
        bleManager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            this.isScanning = false;
            reject(error);
            return;
          }

          if (device?.id && !this.devices.has(device.id)) {
            this.devices.set(device.id, device);
            const mfg = device.manufacturerData
              ? String(device.manufacturerData)
              : undefined;
            const bluetoothSensor: BluetoothSensor = {
              id: device.id,
              name:
                device.name ||
                device.localName ||
                `BLE ${device.id.slice(0, 8)}`,
              localName: device.localName,
              rssi: device.rssi,
              manufacturerData: mfg,
            };
            discoveredDevices.push(bluetoothSensor);
          }
        });

        // Auto-stop scanning after 30 seconds
        setTimeout(() => {
          this.stopScan();
          resolve(discoveredDevices);
        }, 30000);
      });
    } catch (error) {
      console.error("Error scanning for Bluetooth devices:", error);
      throw error;
    }
  }

  /**
   * Stop scanning for Bluetooth devices
   */
  stopScan(): void {
    if (this.isScanning) {
      bleManager.stopDeviceScan();
      this.isScanning = false;
    }
  }

  /**
   * Connect to a Bluetooth device
   */
  async connectToDevice(deviceId: string): Promise<Device | null> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        throw new Error(`Device ${deviceId} not found`);
      }

      const connectedDevice = await bleManager.connectToDevice(deviceId);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      return connectedDevice;
    } catch (error) {
      console.error(`Error connecting to device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a device
   */
  async disconnectFromDevice(deviceId: string): Promise<void> {
    try {
      await bleManager.cancelDeviceConnection(deviceId);
    } catch (error) {
      console.error(`Error disconnecting from device ${deviceId}:`, error);
    }
  }

  /**
   * Detect sensor type from device
   */
  detectSensorType(deviceName: string): string {
    const name = deviceName.toLowerCase();
    for (const sensor of SENSOR_TYPES) {
      if (
        name.includes(sensor.type) ||
        name.includes(sensor.characteristic) ||
        name.includes(sensor.name.split(" ")[0].toLowerCase())
      ) {
        return sensor.type;
      }
    }
    return "multi"; // Default to multi-parameter
  }

  /**
   * Pair a sensor for farm management
   */
  async pairSensor(
    deviceId: string,
    sensorName: string,
  ): Promise<PairedSensor> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        throw new Error(`Device not found: ${deviceId}`);
      }

      const sensorType = this.detectSensorType(device.name || sensorName);
      const pairedSensor: PairedSensor = {
        id: deviceId,
        name: sensorName || device.name || "Unnamed Sensor",
        sensorType,
      };

      return pairedSensor;
    } catch (error) {
      console.error("Error pairing sensor:", error);
      throw error;
    }
  }

  /**
   * Read data from sensor
   */
  async readSensorData(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
  ): Promise<string> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        throw new Error(`Device not found: ${deviceId}`);
      }

      const characteristic = await bleManager.readCharacteristicForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID,
      );

      if (characteristic.value) {
        // Decode base64 value
        const decoded = atob(characteristic.value);
        return decoded;
      }

      return "";
    } catch (error) {
      console.error(`Error reading sensor data:`, error);
      throw error;
    }
  }

  /**
   * Listen to sensor data updates
   */
  async monitorSensorData(
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    onDataReceived: (data: string) => void,
    onError?: (error: Error) => void,
  ): Promise<Subscription> {
    try {
      const subscription = bleManager.monitorCharacteristicForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error("Monitoring error:", error);
            onError?.(error);
            return;
          }

          if (characteristic?.value) {
            const decoded = atob(characteristic.value);
            onDataReceived(decoded);
          }
        },
      );

      return subscription;
    } catch (error) {
      console.error("Error monitoring sensor data:", error);
      throw error;
    }
  }

  /**
   * Get all scanned devices
   */
  getDevices(): BluetoothSensor[] {
    return Array.from(this.devices.values()).map((device) => ({
      id: device.id,
      name: device.name || "Unknown Device",
      localName: device.localName,
      rssi: device.rssi,
    }));
  }

  /**
   * Check if currently scanning
   */
  getIsScanning(): boolean {
    return this.isScanning;
  }
}

export const bluetoothManager = new BluetoothSensorManager();
export default bluetoothManager;
