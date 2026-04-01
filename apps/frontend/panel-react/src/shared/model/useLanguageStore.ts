import { create } from "zustand";

import { TLangList } from "@workspace/shared";
import i18n from "../config/i18n/i18n";

interface ILanguageStore {
  language: TLangList;
  setLanguage: (language: TLangList) => void;
}

export const useLanguageStore = create<ILanguageStore>((set) => ({
  language: "en",
  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
  },
}));
