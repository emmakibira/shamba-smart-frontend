import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useBleScan } from "@/hooks/useBleScan";
import { useTranslation } from "@/hooks/useTranslation";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import bluetoothManager from "@/services/bluetooth";
import { savePairedSensor } from "@/services/sensorDataService";

export default function SensorPairingScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { devices, scanning, error, startScan, stopScan } = useBleScan();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePair = async () => {
    if (!selectedId || !user) return;
    setSaving(true);
    try {
      const paired = await bluetoothManager.pairSensor(selectedId, name || "Farm sensor");
      await savePairedSensor(user.uid, {
        deviceId: paired.id,
        name: paired.name,
        sensorType: paired.sensorType,
        location,
      });
      Alert.alert(
        "OK",
        "Sensor paired and saved to your profile.",
      );
      setSelectedId(null);
      setName("");
      setLocation("");
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Pairing failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pair sensor</Text>
      <Text style={styles.hint}>
        Scan for real BLE devices only. Name and assign a farm location.
      </Text>

      <TouchableOpacity style={styles.btn} onPress={startScan} disabled={scanning}>
        <Text style={styles.btnText}>{t("sensor.scan")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnOutline} onPress={stopScan}>
        <Text style={styles.btnOutlineText}>{t("sensor.stop")}</Text>
      </TouchableOpacity>

      {scanning && <LoadingSpinner />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!scanning && devices.length === 0 && (
        <EmptyState icon="📡" title={t("sensor.noDevices")} />
      )}

      {devices.map((d) => (
        <TouchableOpacity
          key={d.id}
          style={[styles.device, selectedId === d.id && styles.deviceSelected]}
          onPress={() => {
            setSelectedId(d.id);
            setName(d.name);
          }}
        >
          <Text style={styles.deviceName}>{d.name}</Text>
          <Text style={styles.meta}>
            {t("sensor.rssi")}: {d.rssi ?? "—"} dBm
          </Text>
        </TouchableOpacity>
      ))}

      {selectedId && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Sensor name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Farm location / plot"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={handlePair}
            disabled={saving}
          >
            <Text style={styles.btnText}>
              {saving ? t("common.loading") : "Save to Firestore"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F5" },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#1B5E20" },
  hint: { color: "#666", marginVertical: 12 },
  btn: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  btnOutlineText: { color: "#2E7D32", fontWeight: "600" },
  error: { color: "#C62828", marginBottom: 12 },
  device: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  deviceSelected: { borderColor: "#2E7D32" },
  deviceName: { fontWeight: "600", fontSize: 16 },
  meta: { color: "#666", fontSize: 12, marginTop: 4 },
  form: { marginTop: 20 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});
