import axios from "axios";
import { fillTemplate } from "@/constants/smsTemplates";
import { queueSms, getQueuedSms, clearSmsQueue } from "./offlineStorage";

const SMS_API = process.env.EXPO_PUBLIC_SMS_API_URL ?? "";

export interface SendSmsPayload {
  to: string[];
  message: string;
  language?: "sw" | "en";
}

export interface SendBilingualSmsPayload {
  to: string[];
  messageSw: string;
  messageEn: string;
}

export async function sendSms(payload: SendSmsPayload): Promise<void> {
  if (!SMS_API) {
    await queueSms({
      to: payload.to,
      messageSw: payload.message,
      messageEn: payload.message,
    });
    throw new Error("SMS API not configured; message queued offline");
  }

  await axios.post(`${SMS_API}/send`, {
    recipients: payload.to,
    message: payload.message,
    encoding: "UTF-8",
  });
}

export async function sendBilingualSms(
  payload: SendBilingualSmsPayload,
  prefer: "sw" | "en" = "sw",
): Promise<void> {
  const message = prefer === "sw" ? payload.messageSw : payload.messageEn;
  if ([...message].length > 160) {
    throw new Error("SMS exceeds 160 characters");
  }
  await sendSms({ to: payload.to, message, language: prefer });
}

export async function flushSmsQueue(): Promise<number> {
  if (!SMS_API) return 0;
  const queue = await getQueuedSms();
  let sent = 0;
  for (const item of queue) {
    try {
      await sendBilingualSms(item, "sw");
      sent++;
    } catch {
      break;
    }
  }
  if (sent === queue.length) await clearSmsQueue();
  return sent;
}

export function renderTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return fillTemplate(template, vars);
}

export function countSmsSegments(text: string): number {
  const len = [...text].length;
  return len <= 160 ? 1 : Math.ceil(len / 153);
}
