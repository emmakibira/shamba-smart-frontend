import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";

interface UserRow {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  regionId?: string;
}

export default function UserManagementScreen() {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    getDocs(collection(db, "users")).then((snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UserRow[]);
    });
  }, []);

  return (
    <FlatList
      style={styles.list}
      data={users}
      keyExtractor={(u) => u.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.displayName ?? item.email}</Text>
          <Text style={styles.role}>{item.role ?? "farmer"}</Text>
          <Text style={styles.meta}>{item.regionId ?? "No region"}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: { fontWeight: "600", fontSize: 16 },
  role: { color: "#0D47A1", marginTop: 4 },
  meta: { color: "#666", fontSize: 12 },
});
