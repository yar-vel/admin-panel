import { IReqList, IResListMeta } from '../types';
import type { IMenuItem } from '../types/ui';
import { TRoutes } from './types';
/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
export declare const getDateString: (date?: Date | string | number) => string;
/**
 * @param {T} oldObject Original object
 * @param {T} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export declare const getUpdatedValues: <T>(oldObject: T, newObject: T) => Partial<T>;
/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export declare const testString: (regex: RegExp, payload: string) => boolean;
/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
export declare const getErrorText: (error?: unknown, lang?: string) => string;
/**
 * @param {string} href Checked link
 * @param {IMenuItem} navTree Navigation tree
 * @returns {boolean} true if link found in the navigation tree
 */
export declare const checkActiveLink: (href: string, navTree: IMenuItem) => boolean;
/**
 * @param {string} googleClientId Google Client ID
 * @param {string} redirectUri URI to redirect to after login
 * @param {string} state Random string for security
 * @returns {boolean} Google Login URL
 */
export declare const getGoogleSignInUrl: (googleClientId: string, redirectUri: string, state: string) => string;
/**
 * @param {unknown} object The object from which the field is extracted
 * @param {string} field Field name
 * @returns {T | undefined} Field value or nothing
 */
export declare const getField: <T = unknown>(object: unknown, field: string) => T | undefined;
/**
 * @param {IResListMeta} resMeta Metadata from the list-response
 * @returns {IReqList} Request parameters
 */
export declare const resListMetaToReq: <T = unknown, S = T, F = T>(resMeta: IResListMeta<T, S, F>) => IReqList<S> & Record<string, unknown>;
/**
 * @param {object} options Options for creating search parameters
 * @returns {URLSearchParams} Search parameters
 */
export declare const createSearchParams: ({ data, exclude, searchParams, }: {
    data: object;
    exclude?: string[];
    searchParams?: string[][] | Record<string, string> | string | URLSearchParams;
}) => URLSearchParams;
export declare const buildRoutes: <T extends Record<string, unknown>>(tree: T, parent?: string) => TRoutes<T>;
//# sourceMappingURL=utils.d.ts.map