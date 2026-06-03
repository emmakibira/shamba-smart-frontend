import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MINISTRY_REPORT_MAY_2026 } from "@/constants/crops";
import {
  parseMinistryPriceReportText,
  validateMarketReport,
} from "@/services/pdfParser";
import { saveMarketReport } from "@/services/marketDataService";
import type { MarketWeekReport } from "@/types";

export default function MarketDataUploadScreen() {
  const [pdfText, setPdfText] = useState("");
  const [preview, setPreview] = useState<Partial<MarketWeekReport> | null>(
    null,
  );
  const [fileName, setFileName] = useState("");

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setFileName(asset.name);
    Alert.alert(
      "PDF selected",
      `${asset.name}\n\nPaste extracted text below, or use "Import May 2026 report" if this is the Ministry weekly file. Full PDF parsing runs on the upload API in production.`,
    );
  };

  const parseText = () => {
    const parsed = parseMinistryPriceReportText(
      pdfText,
      fileName || "uploaded.pdf",
    );
    const errors = validateMarketReport(parsed);
    if (errors.length) {
      Alert.alert("Parse issues", errors.join("\n"));
    }
    setPreview(parsed);
  };

  const importKnownReport = async () => {
    const report = MINISTRY_REPORT_MAY_2026 as MarketWeekReport;
    await saveMarketReport(report);
    Alert.alert(
      "Saved",
      `Imported ${report.weekLabel} from Ministry PDF data.`,
    );
  };

  const savePreview = async () => {
    if (!preview?.id || !preview.national) {
      Alert.alert("Error", "Parse data first");
      return;
    }
    await saveMarketReport(preview as MarketWeekReport);
    Alert.alert("Saved", "Market data updated in Firestore.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.pad}>
      <Text style={styles.title}>Ministry market PDF upload</Text>
      <Text style={styles.hint}>
        Source: Wizara ya Kilimo weekly report (e.g. 11–15 Mei 2026).
      </Text>

      <TouchableOpacity style={styles.btn} onPress={pickPdf}>
        <Text style={styles.btnText}>Pick PDF file</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnSecondary} onPress={importKnownReport}>
        <Text style={styles.btnSecondaryText}>
          Import May 2026 report (parsed from PDF)
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Paste PDF text (from pdftotext / OCR)</Text>
      <TextInput
        style={styles.area}
        multiline
        value={pdfText}
        onChangeText={setPdfText}
        placeholder="Jedwali 1: Wastani wa bei..."
      />
      <TouchableOpacity style={styles.btn} onPress={parseText}>
        <Text style={styles.btnText}>Preview parsed data</Text>
      </TouchableOpacity>

      {preview && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>
            Week: {preview.weekLabel ?? "—"}
          </Text>
          <Text>National rows: {preview.national?.length ?? 0}</Text>
          <Text>Regions: {preview.regional?.length ?? 0}</Text>
          <TouchableOpacity style={styles.btn} onPress={savePreview}>
            <Text style={styles.btnText}>Confirm & save to Firestore</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pad: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  hint: { color: "#666", marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 8 },
  area: {
    backgroundColor: "#fff",
    minHeight: 120,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    textAlignVertical: "top",
  },
  btn: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnSecondary: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  btnSecondaryText: { color: "#2E7D32", fontWeight: "600" },
  preview: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  previewTitle: { fontWeight: "700", marginBottom: 8 },
});
