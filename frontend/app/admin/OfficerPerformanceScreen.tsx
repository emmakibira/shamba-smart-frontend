import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function OfficerPerformanceScreen() {
  return (
    <ScrollView style={styles.pad}>
      <Text style={styles.title}>Officer performance</Text>
      <Text style={styles.body}>
        Rank officers by advisories published, SMS delivery success, and farmer
        engagement. Wire to Firestore aggregates or your analytics API.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  body: { lineHeight: 22, color: "#444" },
});
