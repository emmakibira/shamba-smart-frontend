import { getQueuedSms, clearSmsQueue } from "./offlineStorage";
import { sendBilingualSms } from "./smsService";
import { getLatestMarketReport } from "./marketDataService";

export async function syncWhenOnline(): Promise<{
  smsSent: number;
  marketCached: boolean;
}> {
  let smsSent = 0;
  const queue = await getQueuedSms();
  for (const item of queue) {
    try {
      await sendBilingualSms(
        { to: item.to, messageSw: item.messageSw, messageEn: item.messageEn },
        "sw",
      );
      smsSent++;
    } catch {
      break;
    }
  }
  if (smsSent > 0) await clearSmsQueue();

  let marketCached = false;
  try {
    await getLatestMarketReport();
    marketCached = true;
  } catch {
    /* ignore */
  }

  return { smsSent, marketCached };
}
