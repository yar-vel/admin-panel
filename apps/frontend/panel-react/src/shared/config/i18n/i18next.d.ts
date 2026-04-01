import "i18next";

import { TLangDictionary } from "@workspace/shared";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: TLangDictionary;
    };
  }
}
