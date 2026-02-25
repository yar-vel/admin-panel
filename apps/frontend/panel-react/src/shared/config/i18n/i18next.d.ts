import "i18next";

import { TLangDictionary } from "@ap/shared/dist/locales";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: TLangDictionary;
    };
  }
}
