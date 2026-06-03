import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Advisory, MarketWeekReport } from "@/types";

const ADVISORIES_KEY = "@offline_advisories";
const MARKET_KEY = "@offline_market";
const SMS_QUEUE_KEY = "@offline_sms_queue";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export async function cacheAdvisories(items: Advisory[]): Promise<void> {
  await AsyncStorage.setItem(
    ADVISORIES_KEY,
    JSON.stringify({ savedAt: Date.now(), items }),
  );
}

export async function getCachedAdvisories(): Promise<Advisory[]> {
  const raw = await AsyncStorage.getItem(ADVISORIES_KEY);
  if (!raw) return [];
  const { savedAt, items } = JSON.parse(raw);
  if (Date.now() - savedAt > MAX_AGE_MS) {
    await AsyncStorage.removeItem(ADVISORIES_KEY);
    return [];
  }
  return items;
}

export async function cacheMarketReport(report: MarketWeekReport): Promise<void> {
  await AsyncStorage.setItem(
    MARKET_KEY,
    JSON.stringify({ savedAt: Date.now(), report }),
  );
}

export async function getCachedMarketReport(): Promise<MarketWeekReport | null> {
  const raw = await AsyncStorage.getItem(MARKET_KEY);
  if (!raw) return null;
  const { savedAt, report } = JSON.parse(raw);
  if (Date.now() - savedAt > MAX_AGE_MS) return null;
  return report;
}

export interface QueuedSms {
  id: string;
  to: string[];
  messageSw: string;
  messageEn: string;
  createdAt: string;
}

export async function queueSms(item: Omit<QueuedSms, "id" | "createdAt">): Promise<void> {
  const raw = await AsyncStorage.getItem(SMS_QUEUE_KEY);
  const queue: QueuedSms[] = raw ? JSON.parse(raw) : [];
  queue.push({
    ...item,
    id: `sms-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  await AsyncStorage.setItem(SMS_QUEUE_KEY, JSON.stringify(queue));
}

export async function getQueuedSms(): Promise<QueuedSms[]> {
  const raw = await AsyncStorage.getItem(SMS_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearSmsQueue(): Promise<void> {
  await AsyncStorage.removeItem(SMS_QUEUE_KEY);
}
