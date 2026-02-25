"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getT = void 0;
const dictionary_1 = require("./dictionary");
const en_1 = require("./list/en");
/**
 * @param {LangList} lang Desired language
 * @returns {LangDictionary} Dictionary in the desired language
 */
const getT = (lang) => lang && lang in dictionary_1.dictionary ? dictionary_1.dictionary[lang] : en_1.en;
exports.getT = getT;
//# sourceMappingURL=utils.js.map