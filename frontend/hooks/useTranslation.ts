import { translate, type TranslationKey } from "@/constants/translations";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTranslation() {
  const { language, toggleLanguage, setLanguage } = useLanguage();

  const t = (key: TranslationKey) => translate(key, language);

  return { t, language, toggleLanguage, setLanguage };
}
