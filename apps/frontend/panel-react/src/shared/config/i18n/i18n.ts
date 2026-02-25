"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { i18nInitOptions } from "./constants";

i18n.use(initReactI18next).init(i18nInitOptions);

export default i18n;
