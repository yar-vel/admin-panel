import i18next from "i18next";

import { i18nInitOptions } from "./constants";

export async function getServerT(lang?: string) {
  const instance = i18next.createInstance();

  await instance.init({ ...i18nInitOptions, lng: lang });

  return instance.t.bind(instance);
}
