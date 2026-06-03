import type { CropKey, CropPriceRow, MarketWeekReport, RegionalMarketPrices } from "@/types";
import { CROP_KEYS } from "@/constants/crops";

/**
 * Parses Ministry of Agriculture Tanzania weekly price report text (Swahili).
 * Used after PDF text extraction on device or officer upload.
 */
export function parseMinistryPriceReportText(
  text: string,
  sourcePdf: string,
): Partial<MarketWeekReport> {
  const weekMatch = text.match(
    /(\d{1,2})\s*[–-]\s*(\d{1,2})\s+(\w+),?\s*(\d{4})/i,
  );
  const weekLabel = weekMatch
    ? `${weekMatch[1]} – ${weekMatch[2]} ${weekMatch[3]}, ${weekMatch[4]}`
    : "Unknown week";

  const national = parseNationalTable(text);
  const regional = parseRegionalBlocks(text);

  const id = weekMatch
    ? `${weekMatch[4]}-${monthToNumber(weekMatch[3])}-${weekMatch[1].padStart(2, "0")}`
    : `report-${Date.now()}`;

  return {
    id,
    weekLabel,
    weekStart: id,
    weekEnd: id,
    sourcePdf,
    uploadedAt: new Date().toISOString(),
    national,
    regional,
  };
}

function monthToNumber(month: string): string {
  const m: Record<string, string> = {
    Januari: "01",
    Februari: "02",
    Machi: "03",
    Aprili: "04",
    Mei: "05",
    Juni: "06",
    Julai: "07",
    Agosti: "08",
    Septemba: "09",
    Oktoba: "10",
    Novemba: "11",
    Desemba: "12",
  };
  return m[month] ?? "01";
}

function parseNationalTable(text: string): CropPriceRow[] {
  const section = text.match(
    /Jedwali 1[\s\S]*?Wiki hii[\s\S]*?(\d+\s+\d+\s+\d+[\s\S]*?)Mbaazi:/i,
  );
  if (!section) return [];

  const numbers = section[1]
    .replace(/[^\d\s.%-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => n > 100 && n < 10000);

  const thisWeek = numbers.slice(0, 7);
  const lastWeek = numbers.slice(7, 14);

  return CROP_KEYS.map((crop, i) => ({
    crop,
    priceThisWeek: thisWeek[i] ?? null,
    priceLastWeek: lastWeek[i] ?? null,
    changePercent:
      thisWeek[i] != null && lastWeek[i]
        ? ((thisWeek[i]! - lastWeek[i]!) / lastWeek[i]!) * 100
        : null,
  }));
}

function parseRegionalBlocks(text: string): RegionalMarketPrices[] {
  const regions: RegionalMarketPrices[] = [];
  const regionNames = [
    "Dodoma",
    "Arusha",
    "Dar es Salaam",
    "Lindi",
    "Morogoro",
    "Tanga",
    "Mtwara",
    "Iringa",
    "Ruvuma",
    "Tabora",
    "Mwanza",
    "Kagera",
    "Singida",
    "Simiyu",
  ];

  for (const name of regionNames) {
    const re = new RegExp(
      `${name}[\\s\\S]*?Wiki hii\\s*([\\d\\s]+)`,
      "i",
    );
    const match = text.match(re);
    if (!match) continue;

    const nums = match[1]
      .trim()
      .split(/\s+/)
      .map(Number)
      .filter((n) => !Number.isNaN(n) && n > 0);

    const prices: CropPriceRow[] = CROP_KEYS.map((crop, i) => ({
      crop,
      priceThisWeek: nums[i] ?? null,
      priceLastWeek: null,
      changePercent: null,
    }));

    regions.push({
      regionId: name.toLowerCase().replace(/\s+/g, "_"),
      regionNameSw: name,
      regionNameEn: name,
      prices,
    });
  }

  return regions;
}

export function validateMarketReport(
  report: Partial<MarketWeekReport>,
): string[] {
  const errors: string[] = [];
  if (!report.national?.length) {
    errors.push("National price table (Jedwali 1) not found");
  }
  if (!report.weekLabel) {
    errors.push("Week date range not found in PDF");
  }
  return errors;
}
