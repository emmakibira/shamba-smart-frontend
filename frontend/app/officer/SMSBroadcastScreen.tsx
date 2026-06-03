import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SMS_TEMPLATES } from "@/constants/smsTemplates";
import { sendSms } from "@/services/smsService";
import { useAuth } from "@/contexts/AuthContext";

const SMS_LIMIT = 160;

export default function SMSBroadcastScreen() {
  const { appUser } = useAuth();
  const [messageSw, setMessageSw] = useState("");
  const [messageEn, setMessageEn] = useState("");
  const [phone, setPhone] = useState(appUser?.phone ?? "");
  const [sending, setSending] = useState(false);

  const send = async (lang: "sw" | "en") => {
    const body = lang === "sw" ? messageSw : messageEn;
    if (!phone || !body) {
      Alert.alert("Error", "Phone and message required");
      return;
    }
    if (body.length > SMS_LIMIT) {
      Alert.alert("Error", `SMS max ${SMS_LIMIT} characters`);
      return;
    }
    setSending(true);
    try {
      await sendSms({ to: [phone], message: body, language: lang });
      Alert.alert("Sent", "SMS queued via external API");
    } catch (e) {
      Alert.alert("Failed", e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Text style={styles.label}>
        Swahili ({messageSw.length}/{SMS_LIMIT})
      </Text>
      <TextInput
        style={styles.area}
        multiline
        value={messageSw}
        onChangeText={setMessageSw}
        maxLength={SMS_LIMIT}
      />
      <Text style={styles.label}>
        English ({messageEn.length}/{SMS_LIMIT})
      </Text>
      <TextInput
        style={styles.area}
        multiline
        value={messageEn}
        onChangeText={setMessageEn}
        maxLength={SMS_LIMIT}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient phone (+255...)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={styles.btn}
        disabled={sending}
        onPress={() => send("sw")}
      >
        <Text style={styles.btnText}>Send Swahili</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnOutline}
        disabled={sending}
        onPress={() => send("en")}
      >
        <Text style={styles.btnOutlineText}>Send English</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Templates</Text>
      {SMS_TEMPLATES.map((tpl) => (
        <TouchableOpacity
          key={tpl.id}
          style={styles.tpl}
          onPress={() => {
            setMessageSw(tpl.bodySw);
            setMessageEn(tpl.bodyEn);
          }}
        >
          <Text style={styles.tplName}>{tpl.id}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7F5" },
  pad: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 6 },
  area: {
    backgroundColor: "#fff",
    minHeight: 80,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  btn: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnOutlineText: { color: "#2E7D32", fontWeight: "600" },
  heading: { fontWeight: "700", marginBottom: 8 },
  tpl: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  tplName: { fontWeight: "500" },
});
