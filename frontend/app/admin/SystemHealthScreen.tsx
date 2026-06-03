import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";

export default function SystemHealthScreen() {
  const [weather, setWeather] = useState("unknown");
  const [sms, setSms] = useState("unknown");
  const api = process.env.EXPO_PUBLIC_API_BASE_URL;
  const weatherUrl = process.env.EXPO_PUBLIC_WEATHER_API_URL;
  const smsUrl = process.env.EXPO_PUBLIC_SMS_API_URL;

  useEffect(() => {
    (async () => {
      if (weatherUrl) {
        try {
          await axios.get(weatherUrl, { timeout: 5000 });
          setWeather("ok");
        } catch {
          setWeather("down");
        }
      } else setWeather("not configured");
      if (smsUrl) {
        try {
          await axios.get(`${smsUrl}/health`, { timeout: 5000 });
          setSms("ok");
        } catch {
          setSms("down");
        }
      } else setSms("not configured");
    })();
  }, [weatherUrl, smsUrl]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Row label="Main API" value={api ? "configured" : "missing"} />
      <Row label="Weather API" value={weather} />
      <Row label="SMS API" value={sms} />
      <Row label="Firebase" value="client SDK" />
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pad: { padding: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: { fontWeight: "600" },
  value: { color: "#666" },
});
