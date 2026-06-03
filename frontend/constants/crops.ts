import type { CropKey } from "@/types";

export const CROP_KEYS: CropKey[] = [
  "mahindi",
  "mchele",
  "maharage",
  "mtama",
  "uwele",
  "ulezi",
  "viazi_mviringo",
];

export const CROP_LABELS: Record<
  CropKey,
  { sw: string; en: string; unit: string }
> = {
  mahindi: { sw: "Mahindi", en: "Maize", unit: "TZS/kg" },
  mchele: { sw: "Mchele", en: "Rice", unit: "TZS/kg" },
  maharage: { sw: "Maharage", en: "Beans", unit: "TZS/kg" },
  mtama: { sw: "Mtama", en: "Sorghum", unit: "TZS/kg" },
  uwele: { sw: "Uwele", en: "Millet", unit: "TZS/kg" },
  ulezi: { sw: "Ulezi", en: "Cassava flour", unit: "TZS/kg" },
  viazi_mviringo: { sw: "Viazi mviringo", en: "Irish potatoes", unit: "TZS/kg" },
};

export const TANZANIA_REGIONS: {
  id: string;
  nameSw: string;
  nameEn: string;
}[] = [
  { id: "national", nameSw: "Wastani wa Nchi", nameEn: "National average" },
  { id: "dodoma", nameSw: "Dodoma", nameEn: "Dodoma" },
  { id: "arusha", nameSw: "Arusha", nameEn: "Arusha" },
  { id: "dar_es_salaam", nameSw: "Dar es Salaam", nameEn: "Dar es Salaam" },
  { id: "lindi", nameSw: "Lindi", nameEn: "Lindi" },
  { id: "morogoro", nameSw: "Morogoro", nameEn: "Morogoro" },
  { id: "tanga", nameSw: "Tanga", nameEn: "Tanga" },
  { id: "mtwara", nameSw: "Mtwara", nameEn: "Mtwara" },
  { id: "iringa", nameSw: "Iringa", nameEn: "Iringa" },
  { id: "ruvuma", nameSw: "Ruvuma", nameEn: "Ruvuma" },
  { id: "tabora", nameSw: "Tabora", nameEn: "Tabora" },
  { id: "rukwa", nameSw: "Rukwa", nameEn: "Rukwa" },
  { id: "kigoma", nameSw: "Kigoma", nameEn: "Kigoma" },
  { id: "shinyanga", nameSw: "Shinyanga", nameEn: "Shinyanga" },
  { id: "mwanza", nameSw: "Mwanza", nameEn: "Mwanza" },
  { id: "kagera", nameSw: "Kagera", nameEn: "Kagera" },
  { id: "mara", nameSw: "Mara", nameEn: "Mara" },
  { id: "manyara", nameSw: "Manyara", nameEn: "Manyara" },
  { id: "njombe", nameSw: "Njombe", nameEn: "Njombe" },
  { id: "katavi", nameSw: "Katavi", nameEn: "Katavi" },
  { id: "singida", nameSw: "Singida", nameEn: "Singida" },
  { id: "geita", nameSw: "Geita", nameEn: "Geita" },
  { id: "songwe", nameSw: "Songwe", nameEn: "Songwe" },
  { id: "simiyu", nameSw: "Simiyu", nameEn: "Simiyu" },
  { id: "pwani", nameSw: "Pwani", nameEn: "Pwani" },
  { id: "mbeya", nameSw: "Mbeya", nameEn: "Mbeya" },
];

function row(
  crop: CropKey,
  thisWeek: number | null,
  lastWeek: number | null,
  changePercent: number | null,
) {
  return { crop, priceThisWeek: thisWeek, priceLastWeek: lastWeek, changePercent };
}

/** Parsed from MoA PDF: Mwenendo wa Bei za Mazao, 11–15 Mei 2026 */
export const MINISTRY_REPORT_MAY_2026 = {
  id: "2026-05-11",
  weekLabel: "11 – 15 Mei, 2026",
  weekStart: "2026-05-11",
  weekEnd: "2026-05-15",
  sourcePdf: "Mwenendo wa Bei za Mazao tarehe 11 - 15 Mei, 2026.pdf",
  uploadedAt: "2026-05-15T00:00:00.000Z",
  national: [
    row("mahindi", 800, 800, 0),
    row("mchele", 2300, 2400, -4.2),
    row("maharage", 2100, 2100, 0),
    row("mtama", 1600, 1700, -5.9),
    row("uwele", 1600, 1600, 0),
    row("ulezi", 2100, 2200, -4.5),
    row("viazi_mviringo", 900, 900, 0),
  ],
  regional: [
    {
      regionId: "dodoma",
      regionNameSw: "Dodoma",
      regionNameEn: "Dodoma",
      prices: [
        row("mahindi", 700, 700, 0),
        row("mchele", 2900, 3000, -3.3),
        row("maharage", 2000, 2100, -4.8),
        row("mtama", 1400, 1400, 0),
        row("uwele", 2100, 2100, 0),
        row("ulezi", null, null, null),
        row("viazi_mviringo", 700, 700, 0),
      ],
    },
    {
      regionId: "arusha",
      regionNameSw: "Arusha",
      regionNameEn: "Arusha",
      prices: [
        row("mahindi", 800, 800, 0),
        row("mchele", 2900, 2900, 0),
        row("maharage", 2100, 2100, 0),
        row("mtama", 1300, 1300, 0),
        row("uwele", 2300, 2300, 0),
        row("ulezi", 900, 1000, -10),
        row("viazi_mviringo", null, null, null),
      ],
    },
    {
      regionId: "dar_es_salaam",
      regionNameSw: "Dar es Salaam",
      regionNameEn: "Dar es Salaam",
      prices: [
        row("mahindi", 900, 1100, -18.2),
        row("mchele", 2900, 3200, -9.4),
        row("maharage", 2800, 2900, -3.4),
        row("mtama", 1300, null, null),
        row("uwele", 1300, null, null),
        row("ulezi", 2300, null, null),
        row("viazi_mviringo", null, 700, null),
      ],
    },
    {
      regionId: "lindi",
      regionNameSw: "Lindi",
      regionNameEn: "Lindi",
      prices: [
        row("mahindi", 800, 900, -11.1),
        row("mchele", 2700, 2700, 0),
        row("maharage", 2400, 2500, -4),
        row("mtama", 2300, 2300, 0),
        row("uwele", 1800, 3300, null),
        row("ulezi", 3300, 800, null),
        row("viazi_mviringo", 800, 800, 0),
      ],
    },
    {
      regionId: "morogoro",
      regionNameSw: "Morogoro",
      regionNameEn: "Morogoro",
      prices: [
        row("mahindi", 900, 1100, -18.2),
        row("mchele", 2900, 2500, 16),
        row("maharage", 2300, 2700, -14.8),
        row("mtama", 1700, 2600, -32),
        row("uwele", null, 2500, -22.2),
        row("ulezi", null, 900, null),
        row("viazi_mviringo", 700, null, null),
      ],
    },
    {
      regionId: "tanga",
      regionNameSw: "Tanga",
      regionNameEn: "Tanga",
      prices: [
        row("mahindi", 900, 1000, -10),
        row("mchele", 2600, 2600, 0),
        row("maharage", 2100, 2000, 5),
        row("mtama", 1200, 1300, -7.7),
        row("uwele", 1400, 1600, -12.5),
        row("ulezi", 2500, 2300, 8.7),
        row("viazi_mviringo", 900, 1400, -35.7),
      ],
    },
    {
      regionId: "mtwara",
      regionNameSw: "Mtwara",
      regionNameEn: "Mtwara",
      prices: [
        row("mahindi", 700, 700, 0),
        row("mchele", 2800, 2800, 0),
        row("maharage", 2100, 2100, 0),
        row("mtama", 2000, 2000, 0),
        row("uwele", null, null, null),
        row("ulezi", 900, 900, 0),
        row("viazi_mviringo", null, null, null),
      ],
    },
    {
      regionId: "iringa",
      regionNameSw: "Iringa",
      regionNameEn: "Iringa",
      prices: [
        row("mahindi", 700, 800, -12.5),
        row("mchele", 2500, 2600, -3.8),
        row("maharage", 2400, 2400, 0),
        row("mtama", 1800, 1800, 0),
        row("uwele", 1900, 1900, 0),
        row("ulezi", 2200, 2300, -4.3),
        row("viazi_mviringo", 600, 600, 0),
      ],
    },
    {
      regionId: "mwanza",
      regionNameSw: "Mwanza",
      regionNameEn: "Mwanza",
      prices: [
        row("mahindi", 900, 900, 0),
        row("mchele", 2400, 2700, null),
        row("maharage", 2400, null, null),
        row("mtama", 1600, null, null),
        row("uwele", 1500, null, null),
        row("ulezi", 2300, null, null),
        row("viazi_mviringo", null, null, null),
      ],
    },
    {
      regionId: "tabora",
      regionNameSw: "Tabora",
      regionNameEn: "Tabora",
      prices: [
        row("mahindi", 600, 700, -14.3),
        row("mchele", 2100, 2100, 0),
        row("maharage", 2200, 2100, 4.8),
        row("mtama", 1900, 1900, 0),
        row("uwele", 1800, 1800, 0),
        row("ulezi", 2100, 2400, -12.5),
        row("viazi_mviringo", 900, 900, 0),
      ],
    },
    {
      regionId: "kagera",
      regionNameSw: "Kagera",
      regionNameEn: "Kagera",
      prices: [
        row("mahindi", 600, 600, 0),
        row("mchele", 2900, 2900, 0),
        row("maharage", 1700, 1700, 0),
        row("mtama", 1200, 1200, 0),
        row("uwele", null, null, null),
        row("ulezi", 1800, null, null),
        row("viazi_mviringo", 600, 600, 0),
      ],
    },
    {
      regionId: "singida",
      regionNameSw: "Singida",
      regionNameEn: "Singida",
      prices: [
        row("mahindi", 700, 700, 0),
        row("mchele", 2800, 2300, 21.7),
        row("maharage", 2100, 2100, 0),
        row("mtama", 1100, 1100, 0),
        row("uwele", 1300, 1300, 0),
        row("ulezi", 1400, 1400, 0),
        row("viazi_mviringo", 1100, null, null),
      ],
    },
    {
      regionId: "simiyu",
      regionNameSw: "Simiyu",
      regionNameEn: "Simiyu",
      prices: [
        row("mahindi", 800, 800, 0),
        row("mchele", 2200, 2400, -8.3),
        row("maharage", 2900, 2600, 11.5),
        row("mtama", 2300, 2300, 0),
        row("uwele", 2300, 2300, 0),
        row("ulezi", 2900, 2900, 0),
        row("viazi_mviringo", 1500, 1500, 0),
      ],
    },
  ],
};
