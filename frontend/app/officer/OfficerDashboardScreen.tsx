import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/services/firebase";

export default function OfficerDashboardScreen() {
  const router = useRouter();
  const { appUser } = useAuth();
  const [farmerCount, setFarmerCount] = useState(0);
  const [advisoryCount, setAdvisoryCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const usersQ = query(
          collection(db, "users"),
          where("role", "==", "farmer"),
        );
        const usersSnap = await getDocs(usersQ);
        setFarmerCount(usersSnap.size);

        const advQ = query(
          collection(db, "advisories"),
          where("createdBy", "==", appUser?.uid ?? ""),
        );
        const advSnap = await getDocs(advQ);
        setAdvisoryCount(advSnap.size);
      } catch {
        /* offline */
      }
    })();
  }, [appUser?.uid]);

  const actions = [
    {
      label: "New advisory",
      route: "/officer/ManageAdvisoriesScreen" as const,
    },
    {
      label: "Send SMS",
      route: "/officer/SMSBroadcastScreen" as const,
    },
    {
      label: "Upload market PDF",
      route: "/officer/MarketDataUploadScreen" as const,
    },
    {
      label: "Manage farmers",
      route: "/officer/FarmerManagementScreen" as const,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        {appUser?.displayName ?? "Officer"} — {appUser?.regionId ?? "All regions"}
      </Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.stat}>{farmerCount}</Text>
          <Text style={styles.label}>Farmers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.stat}>{advisoryCount}</Text>
          <Text style={styles.label}>Your advisories</Text>
        </View>
      </View>
      {actions.map((a) => (
        <TouchableOpacity
          key={a.route}
          style={styles.action}
          onPress={() => router.push(a.route)}
        >
          <Text style={styles.actionText}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F5" },
  content: { padding: 16 },
  greeting: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  row: { flexDirection: "row", gap: 12, marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  stat: { fontSize: 28, fontWeight: "700", color: "#2E7D32" },
  label: { color: "#666", marginTop: 4 },
  action: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: { color: "#fff", fontWeight: "600", textAlign: "center" },
});
