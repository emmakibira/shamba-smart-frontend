import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [counts, setCounts] = useState({ farmers: 0, officers: 0, admins: 0 });

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "users"));
      let farmers = 0;
      let officers = 0;
      let admins = 0;
      snap.forEach((d) => {
        const role = d.data().role;
        if (role === "farmer") farmers++;
        else if (role === "extension_officer") officers++;
        else if (role === "admin") admins++;
      });
      setCounts({ farmers, officers, admins });
    })();
  }, []);

  const links = [
    { label: "User management", href: "/admin/UserManagementScreen" },
    { label: "System health", href: "/admin/SystemHealthScreen" },
    { label: "Advisory approvals", href: "/admin/AdvisoryApprovalScreen" },
    { label: "Officer performance", href: "/admin/OfficerPerformanceScreen" },
    { label: "Regions", href: "/admin/RegionManagementScreen" },
  ] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Text style={styles.title}>Admin dashboard</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.num}>{counts.farmers}</Text>
          <Text>Farmers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.num}>{counts.officers}</Text>
          <Text>Officers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.num}>{counts.admins}</Text>
          <Text>Admins</Text>
        </View>
      </View>
      {links.map((l) => (
        <TouchableOpacity
          key={l.href}
          style={styles.link}
          onPress={() => router.push(l.href)}
        >
          <Text style={styles.linkText}>{l.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECEFF1" },
  pad: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  row: { flexDirection: "row", gap: 8, marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  num: { fontSize: 24, fontWeight: "700", color: "#0D47A1" },
  link: {
    backgroundColor: "#0D47A1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  linkText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  logout: { marginTop: 24, padding: 14, alignItems: "center" },
  logoutText: { color: "#C62828", fontWeight: "600" },
});
