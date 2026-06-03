import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface FarmerRow {
  id: string;
  displayName?: string;
  email?: string;
  phone?: string;
  regionId?: string;
}

export default function FarmerManagementScreen() {
  const { appUser } = useAuth();
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const q = appUser?.regionId
        ? query(
            collection(db, "users"),
            where("role", "==", "farmer"),
            where("regionId", "==", appUser.regionId),
          )
        : query(collection(db, "users"), where("role", "==", "farmer"));
      const snap = await getDocs(q);
      setFarmers(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as FarmerRow[],
      );
    })();
  }, [appUser?.regionId]);

  const filtered = farmers.filter(
    (f) =>
      !search ||
      f.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search farmers..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.displayName ?? "Farmer"}</Text>
            <Text style={styles.meta}>{item.email}</Text>
            <Text style={styles.meta}>{item.phone ?? "—"}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No farmers in your region yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: { fontWeight: "600", fontSize: 16 },
  meta: { color: "#666", fontSize: 13 },
  empty: { textAlign: "center", color: "#666", marginTop: 24 },
});
