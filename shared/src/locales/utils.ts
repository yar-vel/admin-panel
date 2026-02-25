import { dictionary } from './dictionary';
import { en } from './list/en';
import type { TLangDictionary, TLangList } from './types';

/**
 * @param {LangList} lang Desired language
 * @returns {LangDictionary} Dictionary in the desired language
 */
export const getT = (lang?: string): TLangDictionary =>
  lang && lang in dictionary ? dictionary[lang as TLangList] : en;
