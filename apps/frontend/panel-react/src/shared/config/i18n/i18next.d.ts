import "i18next";

import { TLangDictionary } from "@workspace/shared/dist/locales";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: TLangDictionary;
    };
  }
}
