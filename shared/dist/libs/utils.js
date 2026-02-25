"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutes = exports.createSearchParams = exports.resListMetaToReq = exports.getField = exports.getGoogleSignInUrl = exports.checkActiveLink = exports.getErrorText = exports.testString = exports.getUpdatedValues = exports.getDateString = void 0;
const utils_1 = require("../locales/utils");
/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
const getDateString = (date = Date.now()) => {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const now = Date.now();
    const parsedDate = new Date(date);
    const parsedTime = parsedDate.getTime();
    if (isNaN(parsedTime)) {
        return '-';
    }
    const differenceMS = now - parsedTime;
    const minuteMS = 1000 * 60;
    const hourMS = minuteMS * 60;
    const dayMS = hourMS * 24;
    if (differenceMS < minuteMS) {
        return rtf.format(0, 'minute');
    }
    else if (differenceMS < hourMS) {
        return rtf.format(-1 * Math.floor(differenceMS / minuteMS), 'minute');
    }
    else if (differenceMS < dayMS) {
        return rtf.format(-1 * Math.floor(differenceMS / hourMS), 'hour');
    }
    else {
        return parsedDate.toLocaleString();
    }
};
exports.getDateString = getDateString;
/**
 * @param {T} oldObject Original object
 * @param {T} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
const getUpdatedValues = (oldObject, newObject) => {
    const result = {};
    for (const key in newObject) {
        if (newObject[key] !== oldObject[key]) {
            result[key] = newObject[key];
        }
    }
    return result;
};
exports.getUpdatedValues = getUpdatedValues;
/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
const testString = (regex, payload) => {
    return new RegExp(regex).test(payload);
};
exports.testString = testString;
/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
const getErrorText = (error, lang = 'en') => {
    const t = (0, utils_1.getT)(lang);
    if (!(error instanceof Object)) {
        return t.unknownError;
    }
    if (('status' in error && error.status === 429) ||
        ('statusCode' in error && error.statusCode === 429)) {
        return t.tooManyRequests;
    }
    let obj = error;
    if ('data' in obj && obj.data instanceof Object) {
        obj = obj.data;
    }
    if ('message' in obj) {
        if (obj.message instanceof Array) {
            return obj.message.join('.\r\n').concat('.');
        }
        else if (typeof obj.message === 'string') {
            return obj.message;
        }
    }
    return t.unknownError;
};
exports.getErrorText = getErrorText;
/**
 * @param {string} href Checked link
 * @param {IMenuItem} navTree Navigation tree
 * @returns {boolean} true if link found in the navigation tree
 */
const checkActiveLink = (href, navTree) => {
    if (navTree.href) {
        if (href === navTree.href ||
            href.startsWith(`${navTree.href}/`) ||
            href.startsWith(`${navTree.href}?`)) {
            return true;
        }
    }
    if (navTree.childs) {
        return navTree.childs.some((nav) => (0, exports.checkActiveLink)(href, nav));
    }
    return false;
};
exports.checkActiveLink = checkActiveLink;
/**
 * @param {string} googleClientId Google Client ID
 * @param {string} redirectUri URI to redirect to after login
 * @param {string} state Random string for security
 * @returns {boolean} Google Login URL
 */
const getGoogleSignInUrl = (googleClientId, redirectUri, state) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${encodeURIComponent(googleClientId)}`;
    url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
    url += `&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile')}`;
    url += `&state=${encodeURIComponent(state)}`;
    url += '&include_granted_scopes=true';
    url += '&response_type=token';
    return url;
};
exports.getGoogleSignInUrl = getGoogleSignInUrl;
/**
 * @param {unknown} object The object from which the field is extracted
 * @param {string} field Field name
 * @returns {T | undefined} Field value or nothing
 */
const getField = (object, field) => {
    if (typeof object === 'object' && object !== null && field in object) {
        return object[field];
    }
    return undefined;
};
exports.getField = getField;
/**
 * @param {IResListMeta} resMeta Metadata from the list-response
 * @returns {IReqList} Request parameters
 */
const resListMetaToReq = (resMeta) => {
    var _a, _b;
    return {
        reqPage: resMeta.page,
        reqLimit: resMeta.limit,
        reqSortField: (_a = resMeta.sort) === null || _a === void 0 ? void 0 : _a.field,
        reqSortOrder: (_b = resMeta.sort) === null || _b === void 0 ? void 0 : _b.order,
        ...resMeta.filters,
    };
};
exports.resListMetaToReq = resListMetaToReq;
/**
 * @param {object} options Options for creating search parameters
 * @returns {URLSearchParams} Search parameters
 */
const createSearchParams = ({ data, exclude, searchParams, }) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === '' || (exclude === null || exclude === void 0 ? void 0 : exclude.includes(key))) {
            return;
        }
        newParams.set(key, String(value));
    });
    return newParams;
};
exports.createSearchParams = createSearchParams;
const buildRoutes = (tree, parent = '') => {
    var _a;
    const result = {};
    let base = tree['_'] === '/' ? '' : String((_a = tree['_']) !== null && _a !== void 0 ? _a : '');
    if (base) {
        base = (base[0] !== '/' ? '/' : '') + base;
    }
    if (parent && parent !== '/') {
        base = (parent[0] !== '/' ? '/' : '') + parent + base;
    }
    for (const key in tree) {
        const value = tree[key];
        if (key === '_') {
            result[key] = base;
            continue;
        }
        if (typeof value === 'object') {
            result[key] = (0, exports.buildRoutes)(value, base);
        }
        else if (typeof value === 'function') {
            result[key] = (...args) => {
                let fixedValue = value(...args);
                if (fixedValue[0] !== '/') {
                    fixedValue = '/' + fixedValue;
                }
                return base + fixedValue;
            };
        }
        else {
            result[key] = base + (String(value)[0] !== '/' ? '/' : '') + value;
        }
    }
    return result;
};
exports.buildRoutes = buildRoutes;
//# sourceMappingURL=utils.js.map