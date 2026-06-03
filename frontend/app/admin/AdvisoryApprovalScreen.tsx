import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import type { Advisory } from "@/types";

export default function AdvisoryApprovalScreen() {
  const [pending, setPending] = useState<Advisory[]>([]);

  const load = async () => {
    const q = query(
      collection(db, "advisories"),
      where("status", "==", "pending_approval"),
    );
    const snap = await getDocs(q);
    setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advisory));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    await updateDoc(doc(db, "advisories", id), {
      status: "published",
      publishedAt: new Date().toISOString(),
    });
    await load();
    Alert.alert("Approved");
  };

  return (
    <FlatList
      style={styles.list}
      data={pending}
      keyExtractor={(a) => a.id}
      ListEmptyComponent={
        <Text style={styles.empty}>No pending advisories.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={3}>{item.content}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => approve(item.id)}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, padding: 16 },
  empty: { textAlign: "center", marginTop: 40, color: "#666" },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontWeight: "700", marginBottom: 8 },
  btn: {
    backgroundColor: "#0D47A1",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
