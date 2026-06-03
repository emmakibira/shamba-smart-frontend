import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Text style={styles.title}>Officer analytics</Text>
      <Text style={styles.body}>
        Advisory views, SMS delivery rates, and farmer engagement charts connect
        to your hosted analytics API. Configure EXPO_PUBLIC_API_BASE_URL for
        live metrics.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pad: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  body: { color: "#444", lineHeight: 22 },
});
