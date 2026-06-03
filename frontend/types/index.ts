export type UserRole = "farmer" | "extension_officer" | "admin";

export type LanguageCode = "sw" | "en";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  regionId?: string;
  phone?: string;
  permissions?: string[];
}

export type CropKey =
  | "mahindi"
  | "mchele"
  | "maharage"
  | "mtama"
  | "uwele"
  | "ulezi"
  | "viazi_mviringo";

export interface CropPriceRow {
  crop: CropKey;
  priceThisWeek: number | null;
  priceLastWeek: number | null;
  changePercent: number | null;
}

export interface RegionalMarketPrices {
  regionId: string;
  regionNameSw: string;
  regionNameEn: string;
  prices: CropPriceRow[];
}

export interface MarketWeekReport {
  id: string;
  weekLabel: string;
  weekStart: string;
  weekEnd: string;
  sourcePdf: string;
  uploadedAt: string;
  national: CropPriceRow[];
  regional: RegionalMarketPrices[];
}

export interface Advisory {
  id: string;
  title: string;
  titleSw?: string;
  content: string;
  contentSw?: string;
  crops: string[];
  regionIds: string[];
  status: "draft" | "published" | "scheduled" | "pending_approval";
  publishedAt?: string;
  createdBy: string;
}

export interface SensorReading {
  sensorId: string;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  recordedAt: string;
}
