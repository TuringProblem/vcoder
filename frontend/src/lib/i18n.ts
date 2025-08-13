import enTranslations from "../data/i18n/en.json";

type TranslationKey = string;
type TranslationValue = string | Record<string, any>;

class I18n {
  private translations: Record<string, any> = enTranslations;

  t(key: TranslationKey, params?: Record<string, string>): string {
    const keys = key.split(".");
    let value: TranslationValue = this.translations;

    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value;
  }

  setLanguage(language: string) {
    this.translations = enTranslations;
  }
}

export const i18n = new I18n();

export function t(
  key: TranslationKey,
  params?: Record<string, string>,
): string {
  return i18n.t(key, params);
}
