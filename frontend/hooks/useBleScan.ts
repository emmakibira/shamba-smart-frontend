import { useCallback, useState } from "react";
import bluetoothManager, {
  type BluetoothSensor,
} from "@/services/bluetooth";

export function useBleScan() {
  const [devices, setDevices] = useState<BluetoothSensor[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = useCallback(async () => {
    setError(null);
    setScanning(true);
    setDevices([]);
    try {
      const found = await bluetoothManager.startScan();
      setDevices(found);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    bluetoothManager.stopScan();
    setScanning(false);
    setDevices(bluetoothManager.getDevices());
  }, []);

  return { devices, scanning, error, startScan, stopScan };
}
