# Shamba Smart (Expo / React Native)

Tanzania smart farming app: Firebase auth, Ministry PDF market prices, real BLE sensors, bilingual Swahili/English UI, and role-based navigation (farmer, extension officer, admin).

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

Fill in Firebase and API URLs from your Firebase Console and hosted backends.

2. Install and run:

```bash
cd frontend
npm install
npx expo start
```

3. **Bluetooth sensors** require a development build (not Expo Go):

```bash
npx expo prebuild
npx expo run:android
```

## Market data (Ministry PDF)

Weekly prices come from uploaded Ministry reports. The repo includes **Mwenendo wa Bei za Mazao tarehe 11 - 15 Mei, 2026.pdf** at the project root. Parsed values live in `constants/crops.ts` as `MINISTRY_REPORT_MAY_2026` and are loaded via `marketDataService`.

Officers can re-import this report from **Market PDF** screen or paste PDF text for `pdfParser` preview.

## Roles

| Role | Navigation |
|------|------------|
| Farmer | Drawer: Dashboard, Market, Advisory, Community, Sensors, Profile |
| Extension officer | Stack under `/officer` |
| Admin | Stack under `/admin` |

Registration codes: `EXPO_PUBLIC_OFFICER_REGISTRATION_CODE`, `EXPO_PUBLIC_ADMIN_REGISTRATION_CODE`.

## Session timeout

30 minutes inactivity (configurable). Warning modal at 5 minutes remaining.

## Firestore rules

Deploy `firestore.rules` from this folder to your Firebase project.
