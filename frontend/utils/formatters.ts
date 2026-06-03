import type { LanguageCode } from "@/types";

export function formatCurrencyTzs(amount: number | null): string {
  if (amount === null || Number.isNaN(amount)) return "—";
  return `TZS ${amount.toLocaleString("en-TZ")}`;
}

export function formatPercent(change: number | null): string {
  if (change === null || Number.isNaN(change)) return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export function formatDate(
  iso: string,
  lang: LanguageCode = "en",
): string {
  const locale = lang === "sw" ? "sw-TZ" : "en-TZ";
  return new Date(iso).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function smsCharCount(text: string): number {
  return [...text].length;
}

export function estimateSmsCost(recipients: number, segments = 1): number {
  const ratePerSms = 25;
  return recipients * segments * ratePerSms;
}
