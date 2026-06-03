import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  danger,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={onCancel}>
              <Text>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirm, danger && styles.danger]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{t("common.save")}</Text>
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  message: { color: "#444", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  cancel: { padding: 10 },
  confirm: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  danger: { backgroundColor: "#C62828" },
  confirmText: { color: "#fff", fontWeight: "600" },
});
