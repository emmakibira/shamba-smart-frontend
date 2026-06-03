import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  visible: boolean;
  remainingMs: number;
  onExtend: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutModal({
  visible,
  remainingMs,
  onExtend,
  onLogout,
}: Props) {
  const { t, language } = useTranslation();
  const [displaySec, setDisplaySec] = useState(0);

  useEffect(() => {
    setDisplaySec(Math.max(0, Math.ceil(remainingMs / 1000)));
  }, [remainingMs, visible]);

  const minutes = Math.floor(displaySec / 60);
  const seconds = displaySec % 60;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{t("session.warning")}</Text>
          <Text style={styles.timer}>
            {t("session.expiresIn")}: {minutes}:{seconds.toString().padStart(2, "0")}
          </Text>
          {language === "sw" && (
            <Text style={styles.sub}>
              Kikao kinamalizika baada ya dakika 30 bila shughuli.
            </Text>
          )}
          {language === "en" && (
            <Text style={styles.sub}>
              Sessions end after 30 minutes of inactivity.
            </Text>
          )}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primary} onPress={onExtend}>
              <Text style={styles.primaryText}>{t("session.extend")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={onLogout}>
              <Text style={styles.secondaryText}>{t("session.logout")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1B5E20", marginBottom: 8 },
  timer: { fontSize: 28, fontWeight: "bold", color: "#333", marginVertical: 12 },
  sub: { fontSize: 14, color: "#666", marginBottom: 20 },
  actions: { gap: 10 },
  primary: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  secondary: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  secondaryText: { color: "#666", fontWeight: "600" },
});
