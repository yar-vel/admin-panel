import { InitOptions, Resource } from "i18next";

import { dictionary } from "@workspace/shared";

export const languages = {
  en: {
    translation: dictionary.en,
  },
} as const satisfies Resource;

export const i18nInitOptions: InitOptions = {
  resources: languages,
  lng: dictionary.en.langCode,
  fallbackLng: dictionary.en.langCode,
  interpolation: {
    escapeValue: false,
  },
};
