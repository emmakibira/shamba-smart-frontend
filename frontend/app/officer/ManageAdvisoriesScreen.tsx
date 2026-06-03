import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/services/firebase";
import type { Advisory } from "@/types";

export default function ManageAdvisoriesScreen() {
  const { appUser } = useAuth();
  const [title, setTitle] = useState("");
  const [titleSw, setTitleSw] = useState("");
  const [content, setContent] = useState("");
  const [contentSw, setContentSw] = useState("");
  const [list, setList] = useState<Advisory[]>([]);

  const load = async () => {
    if (!appUser) return;
    const q = query(
      collection(db, "advisories"),
      where("createdBy", "==", appUser.uid),
    );
    const snap = await getDocs(q);
    setList(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advisory),
    );
  };

  useEffect(() => {
    load();
  }, [appUser]);

  const publish = async () => {
    if (!title || !content) {
      Alert.alert("Error", "Title and content required");
      return;
    }
    await addDoc(collection(db, "advisories"), {
      title,
      titleSw: titleSw || title,
      content,
      contentSw: contentSw || content,
      crops: [],
      regionIds: appUser?.regionId ? [appUser.regionId] : ["all"],
      status: "published",
      publishedAt: new Date().toISOString(),
      createdBy: appUser?.uid,
    });
    setTitle("");
    setTitleSw("");
    setContent("");
    setContentSw("");
    await load();
    Alert.alert("Published", "Advisory is live for farmers.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Text style={styles.heading}>Create advisory (EN / SW)</Text>
      <TextInput
        style={styles.input}
        placeholder="Title (English)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Kichwa (Kiswahili)"
        value={titleSw}
        onChangeText={setTitleSw}
      />
      <TextInput
        style={[styles.input, styles.area]}
        placeholder="Content (English)"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={[styles.input, styles.area]}
        placeholder="Maudhui (Kiswahili)"
        multiline
        value={contentSw}
        onChangeText={setContentSw}
      />
      <TouchableOpacity style={styles.btn} onPress={publish}>
        <Text style={styles.btnText}>Publish</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Your advisories</Text>
      {list.map((a) => (
        <View key={a.id} style={styles.item}>
          <Text style={styles.itemTitle}>{a.title}</Text>
          <Text style={styles.status}>{a.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pad: { padding: 16 },
  heading: { fontSize: 16, fontWeight: "700", marginVertical: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  area: { minHeight: 80, textAlignVertical: "top" },
  btn: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 24,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: { fontWeight: "600" },
  status: { color: "#666", fontSize: 12 },
});
