import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { TANZANIA_REGIONS } from "@/constants/crops";
import { db } from "@/services/firebase";

interface RegionDoc {
  id: string;
  nameSw: string;
  nameEn: string;
}

export default function RegionManagementScreen() {
  const [regions, setRegions] = useState<RegionDoc[]>([]);
  const [nameSw, setNameSw] = useState("");
  const [nameEn, setNameEn] = useState("");

  const load = async () => {
    const snap = await getDocs(collection(db, "regions"));
    if (snap.empty) {
      setRegions(
        TANZANIA_REGIONS.filter((r) => r.id !== "national").map((r) => ({
          id: r.id,
          nameSw: r.nameSw,
          nameEn: r.nameEn,
        })),
      );
      return;
    }
    setRegions(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as RegionDoc),
    );
  };

  useEffect(() => {
    load();
  }, []);

  const addRegion = async () => {
    if (!nameSw || !nameEn) return;
    await addDoc(collection(db, "regions"), { nameSw, nameEn });
    setNameSw("");
    setNameEn("");
    await load();
    Alert.alert("Added");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name (Swahili)"
          value={nameSw}
          onChangeText={setNameSw}
        />
        <TextInput
          style={styles.input}
          placeholder="Name (English)"
          value={nameEn}
          onChangeText={setNameEn}
        />
        <TouchableOpacity style={styles.btn} onPress={addRegion}>
          <Text style={styles.btnText}>Add region</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={regions}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nameSw}</Text>
            <Text style={styles.sub}>{item.nameEn}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  btn: {
    backgroundColor: "#0D47A1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  name: { fontWeight: "600" },
  sub: { color: "#666" },
});
