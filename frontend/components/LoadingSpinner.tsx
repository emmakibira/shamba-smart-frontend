import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  message?: string;
  overlay?: boolean;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export default function LoadingSpinner({
  message,
  overlay = false,
  size = "large",
  color = "#2E7D32",
  style,
}: Props) {
  const content = (
    <View style={[styles.box, style]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible>
        <View style={styles.overlay}>{content}</View>
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: { alignItems: "center", padding: 16 },
  message: { marginTop: 12, color: "#666", fontSize: 14 },
});
