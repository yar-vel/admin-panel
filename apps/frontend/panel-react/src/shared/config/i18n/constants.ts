import { InitOptions, Resource } from "i18next";

import { en } from "@ap/shared/dist/locales/list/en";

export const languages = {
  en: {
    translation: en,
  },
} as const satisfies Resource;

export const i18nInitOptions: InitOptions = {
  resources: languages,
  lng: en.langCode,
  fallbackLng: en.langCode,
  interpolation: {
    escapeValue: false,
  },
};
