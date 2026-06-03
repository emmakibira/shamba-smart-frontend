import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bluetooth, Radio, Wifi } from "lucide-react-native";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTranslation } from "@/hooks/useTranslation";
import { useBleScan } from "@/hooks/useBleScan";
import bluetoothManager from "@/services/bluetooth";

export default function SensorScannerScreen() {
  const { t } = useTranslation();
  const { devices, scanning, error, startScan, stopScan } = useBleScan();
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<string | null>(null);

  const handleConnect = async (deviceId: string) => {
    try {
      await bluetoothManager.connectToDevice(deviceId);
      setConnectedId(deviceId);
      setLiveData(null);
    } catch (e) {
      setLiveData(e instanceof Error ? e.message : "Connection failed");
    }
  };

  const handleDisconnect = async () => {
    if (connectedId) {
      await bluetoothManager.disconnectFromDevice(connectedId);
      setConnectedId(null);
      setLiveData(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("sensor.title")}</Text>
      <Text style={styles.hint}>
        {Platform.OS === "android"
          ? "Bluetooth + location permissions required for scanning."
          : "Enable Bluetooth to discover nearby sensors."}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, scanning && styles.btnDisabled]}
          onPress={startScan}
          disabled={scanning}
        >
          <Radio size={18} color="#fff" />
          <Text style={styles.btnText}>{t("sensor.scan")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={stopScan}>
          <Text style={styles.btnOutlineText}>{t("sensor.stop")}</Text>
        </TouchableOpacity>
      </View>

      {scanning && <LoadingSpinner message={t("common.loading")} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {connectedId && (
        <View style={styles.connectedCard}>
          <Bluetooth size={20} color="#2E7D32" />
          <Text style={styles.connectedText}>
            Connected: {connectedId.slice(0, 8)}…
          </Text>
          <TouchableOpacity onPress={handleDisconnect}>
            <Text style={styles.link}>{t("sensor.disconnect")}</Text>
          </TouchableOpacity>
          {liveData ? <Text style={styles.live}>{liveData}</Text> : null}
        </View>
      )}

      {!scanning && devices.length === 0 ? (
        <EmptyState
          icon="📡"
          title={t("sensor.noDevices")}
          description="Only real BLE devices appear here—no mock data."
        />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.deviceCard}>
              <View style={styles.deviceRow}>
                <Wifi size={18} color="#2E7D32" />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceMeta}>
                    {t("sensor.rssi")}: {item.rssi ?? "—"} dBm
                  </Text>
                  {item.localName ? (
                    <Text style={styles.deviceMeta}>{item.localName}</Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity
                style={styles.connectBtn}
                onPress={() => handleConnect(item.id)}
              >
                <Text style={styles.connectText}>{t("sensor.connect")}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#1B5E20" },
  hint: { fontSize: 13, color: "#666", marginTop: 4, marginBottom: 16 },
  actions: { flexDirection: "row", gap: 10, marginBottom: 16 },
  btn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#2E7D32" },
  btnOutlineText: { color: "#2E7D32", fontWeight: "600" },
  error: { color: "#c62828", marginBottom: 12 },
  connectedCard: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 6,
  },
  connectedText: { fontWeight: "600", color: "#1B5E20" },
  link: { color: "#c62828", fontWeight: "600" },
  live: { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 12 },
  deviceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  deviceRow: { flexDirection: "row", gap: 10 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: "600" },
  deviceMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  connectBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#2E7D32",
    borderRadius: 6,
  },
  connectText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
