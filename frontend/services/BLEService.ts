// services/BLEService.ts
import { BleManager, Device, ScanMode, State } from 'react-native-ble-plx';
import { Platform, Alert } from 'react-native';
import * as Location from 'expo-location';

export interface BLEDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  serviceUUIDs: string[];
  manufacturerData?: string | null;
}

export interface SensorData {
  deviceId: string;
  deviceName: string;
  soilMoisture?: number;
  temperature?: number;
  humidity?: number;
  batteryLevel?: number;
  timestamp: Date;
}

class BLEService {
  private manager: BleManager;
  private devices: Map<string, BLEDevice> = new Map();
  private isScanning: boolean = false;
  private onDeviceDiscovered?: (device: BLEDevice) => void;
  private onSensorDataReceived?: (data: SensorData) => void;

  constructor() {
    this.manager = new BleManager();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.manager.onStateChange((state) => {
      console.log('BLE State:', state);
      if (state === State.PoweredOn) {
        console.log('Bluetooth is powered on');
      }
    }, true);
  }

  async requestBluetoothPermissions(): Promise<boolean> {
    try {
      // For Android 12+ (API 31+), we need location permission for Bluetooth scanning
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission Required',
            'Location permission is required to scan for Bluetooth devices on Android 12+',
            [{ text: 'OK' }]
          );
          return false;
        }
      }
      
      // Bluetooth is already requested in app.json permissions
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async startScan(onDeviceDiscovered?: (device: BLEDevice) => void): Promise<void> {
    const hasPermissions = await this.requestBluetoothPermissions();
    if (!hasPermissions) {
      return;
    }

    this.onDeviceDiscovered = onDeviceDiscovered;
    this.isScanning = true;
    this.devices.clear();

    try {
      await this.manager.startDeviceScan(
        null,
        {
          scanMode: ScanMode.LowLatency,
          allowDuplicates: false,
        },
        (error, device) => {
          if (error) {
            console.error('Scan error:', error);
            return;
          }

          if (device) {
            // Filter for IoT sensor devices (you can customize this based on device name or service UUIDs)
            const isSensorDevice = device.name && (
              device.name.toLowerCase().includes('sensor') ||
              device.name.toLowerCase().includes('farm') ||
              device.name.toLowerCase().includes('iot') ||
              device.name.toLowerCase().includes('soil') ||
              device.name.toLowerCase().includes('temp')
            );

            if (isSensorDevice || !device.name) {
              const bleDevice: BLEDevice = {
                id: device.id,
                name: device.name || 'Unknown Sensor',
                rssi: device.rssi,
                serviceUUIDs: device.serviceUUIDs || [],
                manufacturerData: device.manufacturerData,
              };

              if (!this.devices.has(device.id)) {
                this.devices.set(device.id, bleDevice);
                if (this.onDeviceDiscovered) {
                  this.onDeviceDiscovered(bleDevice);
                }
              }
            }
          }
        }
      );

      // Auto-stop scanning after 30 seconds
      setTimeout(() => {
        if (this.isScanning) {
          this.stopScan();
        }
      }, 30000);
    } catch (error) {
      console.error('Error starting scan:', error);
      this.isScanning = false;
    }
  }

  stopScan(): void {
    if (this.isScanning) {
      this.manager.stopDeviceScan();
      this.isScanning = false;
    }
  }

  async connectToDevice(deviceId: string, onDataReceived?: (data: SensorData) => void): Promise<boolean> {
    try {
      this.onSensorDataReceived = onDataReceived;
      
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      
      // Common service UUIDs for IoT sensors (you may need to adjust these)
      const serviceUUIDs = [
        '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
        '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
        '0000181a-0000-1000-8000-00805f9b34fb', // Environmental Sensing
      ];
      
      // Check for battery service
      const batteryService = await device.discoverServiceForUUID('0000180f-0000-1000-8000-00805f9b34fb');
      if (batteryService) {
        const batteryChar = await device.discoverCharacteristicForService(
          '0000180f-0000-1000-8000-00805f9b34fb',
          '00002a19-0000-1000-8000-00805f9b34fb'
        );
        
        if (batteryChar) {
          await batteryChar.read();
          // Monitor battery level changes
          await batteryChar.monitor((error, characteristic) => {
            if (!error && characteristic?.value) {
              const batteryLevel = parseInt(characteristic.value, 16);
              // Update battery level in sensor data
            }
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      Alert.alert('Connection Error', 'Failed to connect to the sensor device. Please make sure it\'s powered on and in range.');
      return false;
    }
  }

  async readSensorData(deviceId: string): Promise<SensorData | null> {
    try {
      const device = await this.manager.devices([deviceId]);
      if (!device[0]) return null;
      
      // This is example data - actual implementation depends on your sensor's characteristics
      const mockData: SensorData = {
        deviceId: deviceId,
        deviceName: device[0].name || 'Sensor',
        soilMoisture: Math.random() * 100,
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        batteryLevel: 50 + Math.random() * 50,
        timestamp: new Date(),
      };
      
      return mockData;
    } catch (error) {
      console.error('Error reading sensor data:', error);
      return null;
    }
  }

  async disconnectDevice(deviceId: string): Promise<void> {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  getDiscoveredDevices(): BLEDevice[] {
    return Array.from(this.devices.values());
  }

  isScanningActive(): boolean {
    return this.isScanning;
  }

  async getBluetoothState(): Promise<State> {
    return await this.manager.state();
  }

  cleanup() {
    this.stopScan();
    this.manager.destroy();
  }
}

export default new BLEService();