import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

export default function LanguageToggle() {
  const { toggleLanguage, t } = useTranslation();

  return (
    <TouchableOpacity style={styles.btn} onPress={toggleLanguage}>
      <Text style={styles.text}>🌐 {t("language.toggle")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
  },
  text: { color: "#1B5E20", fontWeight: "600", fontSize: 13 },
});
