import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { MINISTRY_REPORT_MAY_2026 } from "@/constants/crops";
import type { CropKey, MarketWeekReport, RegionalMarketPrices } from "@/types";
import { db } from "./firebase";
import api from "./api";

const CACHE_KEY = "@market_latest_report";

export async function ensureSeedReportLoaded(): Promise<MarketWeekReport> {
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as MarketWeekReport;
  }

  const report = MINISTRY_REPORT_MAY_2026 as MarketWeekReport;
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(report));

  try {
    await setDoc(doc(db, "marketReports", report.id), report, { merge: true });
  } catch {
    // Firestore optional when offline / unconfigured
  }

  return report;
}

export async function getLatestMarketReport(): Promise<MarketWeekReport | null> {
  try {
    const data = await api.getLatestMarketReport();
    if (data && data.id) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data as MarketWeekReport;
    }
  } catch (error) {
    console.log("Failed to fetch market report from Django API, falling back to Firestore");
  }

  try {
    const q = query(
      collection(db, "marketReports"),
      orderBy("weekEnd", "desc"),
      limit(1),
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data() as MarketWeekReport;
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch {
    // fall through to cache/seed
  }

  try {
    return await ensureSeedReportLoaded();
  } catch {
    return null;
  }
}

export async function saveMarketReport(report: MarketWeekReport): Promise<void> {
  await setDoc(doc(db, "marketReports", report.id), report, { merge: true });
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(report));
}

export function getNationalAverage(
  report: MarketWeekReport,
  crop: CropKey,
): number | null {
  const row = report.national.find((p) => p.crop === crop);
  return row?.priceThisWeek ?? null;
}

export function getRegionalPrices(
  report: MarketWeekReport,
  regionId: string,
): RegionalMarketPrices | undefined {
  if (regionId === "national") {
    return {
      regionId: "national",
      regionNameSw: "Wastani wa Nchi",
      regionNameEn: "National average",
      prices: report.national,
    };
  }
  return report.regional.find((r) => r.regionId === regionId);
}

export function computeNationalAverageFromRegions(
  report: MarketWeekReport,
  crop: CropKey,
): number | null {
  const values = report.regional
    .map((r) => r.prices.find((p) => p.crop === crop)?.priceThisWeek)
    .filter((v): v is number => v !== null && v !== undefined);
  if (!values.length) return getNationalAverage(report, crop);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export async function getReportById(id: string): Promise<MarketWeekReport | null> {
  try {
    const snap = await getDoc(doc(db, "marketReports", id));
    if (snap.exists()) return snap.data() as MarketWeekReport;
  } catch {
    /* ignore */
  }
  if (id === MINISTRY_REPORT_MAY_2026.id) {
    return MINISTRY_REPORT_MAY_2026 as MarketWeekReport;
  }
  return null;
}
