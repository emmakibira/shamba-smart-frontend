import type { LanguageCode } from "@/types";

export type TranslationKey =
  | "app.name"
  | "nav.dashboard"
  | "nav.market"
  | "nav.advisory"
  | "nav.community"
  | "nav.sensors"
  | "nav.profile"
  | "market.title"
  | "market.subtitle"
  | "market.search"
  | "market.nationalAvg"
  | "market.lastUpdated"
  | "market.noData"
  | "market.filterCrop"
  | "market.filterRegion"
  | "market.weekReport"
  | "sensor.title"
  | "sensor.scan"
  | "sensor.stop"
  | "sensor.noDevices"
  | "sensor.connect"
  | "sensor.disconnect"
  | "sensor.rssi"
  | "session.warning"
  | "session.extend"
  | "session.logout"
  | "session.expiresIn"
  | "auth.login"
  | "auth.register"
  | "auth.email"
  | "auth.password"
  | "auth.farmer"
  | "auth.officer"
  | "auth.admin"
  | "auth.adminCode"
  | "common.loading"
  | "common.error"
  | "common.retry"
  | "common.save"
  | "common.cancel"
  | "language.toggle";

const strings: Record<TranslationKey, Record<LanguageCode, string>> = {
  "app.name": { sw: "Shamba Smart", en: "Shamba Smart" },
  "nav.dashboard": { sw: "Dashibodi", en: "Dashboard" },
  "nav.market": { sw: "Masoko", en: "Market" },
  "nav.advisory": { sw: "Ushauri", en: "Advisory" },
  "nav.community": { sw: "Jamii", en: "Community" },
  "nav.sensors": { sw: "Vihisio", en: "Sensors" },
  "nav.profile": { sw: "Wasifu", en: "Profile" },
  "market.title": { sw: "Bei za Mazao", en: "Crop Prices" },
  "market.subtitle": {
    sw: "Kutoka Wizara ya Kilimo (PDF)",
    en: "From Ministry of Agriculture (PDF)",
  },
  "market.search": { sw: "Tafuta zao au mkoa...", en: "Search crop or region..." },
  "market.nationalAvg": { sw: "Wastani wa Nchi", en: "National average" },
  "market.lastUpdated": { sw: "Imesasishwa", en: "Last updated" },
  "market.noData": {
    sw: "Hakuna bei. Pakia PDF ya Wizara ya Kilimo.",
    en: "No prices. Upload Ministry PDF report.",
  },
  "market.filterCrop": { sw: "Chagua zao", en: "Select crop" },
  "market.filterRegion": { sw: "Chagua mkoa", en: "Select region" },
  "market.weekReport": { sw: "Wiki ya ripoti", en: "Report week" },
  "sensor.title": { sw: "Kichanganuzi cha Vihisio", en: "Sensor Scanner" },
  "sensor.scan": { sw: "Anza utafutaji", en: "Start scan" },
  "sensor.stop": { sw: "Simamisha", en: "Stop scan" },
  "sensor.noDevices": {
    sw: "Hakuna vifaa vya Bluetooth vilivyopatikana",
    en: "No Bluetooth devices found",
  },
  "sensor.connect": { sw: "unganisha", en: "Connect" },
  "sensor.disconnect": { sw: "Tenganisha", en: "Disconnect" },
  "sensor.rssi": { sw: "Nguvu ya ishara", en: "Signal strength" },
  "session.warning": {
    sw: "Kikao chako kinakaribia kuisha. Endelea kutumia programu?",
    en: "Your session is about to expire. Stay signed in?",
  },
  "session.extend": { sw: "Endelea", en: "Extend session" },
  "session.logout": { sw: "Toka", en: "Log out" },
  "session.expiresIn": { sw: "Muda uliobaki", en: "Time remaining" },
  "auth.login": { sw: "Ingia", en: "Log in" },
  "auth.register": { sw: "Jisajili", en: "Register" },
  "auth.email": { sw: "Barua pepe", en: "Email" },
  "auth.password": { sw: "Nenosiri", en: "Password" },
  "auth.farmer": { sw: "Mkulima", en: "Farmer" },
  "auth.officer": { sw: "Afisa Miundombinu", en: "Extension Officer" },
  "auth.admin": { sw: "Msimamizi", en: "Admin" },
  "auth.adminCode": { sw: "Nambari ya msimamizi", en: "Admin code" },
  "common.loading": { sw: "Inapakia...", en: "Loading..." },
  "common.error": { sw: "Hitilafu", en: "Error" },
  "common.retry": { sw: "Jaribu tena", en: "Retry" },
  "common.save": { sw: "Hifadhi", en: "Save" },
  "common.cancel": { sw: "Ghairi", en: "Cancel" },
  "language.toggle": { sw: "English", en: "Kiswahili" },
};

export function translate(key: TranslationKey, lang: LanguageCode): string {
  return strings[key]?.[lang] ?? key;
}

export default strings;
