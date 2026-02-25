import { getT } from '../locales/utils';
import { IReqList, IResListMeta } from '../types';
import type { IMenuItem } from '../types/ui';
import { TRoutes } from './types';

/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
export const getDateString = (
  date: Date | string | number = Date.now(),
): string => {
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
  } else if (differenceMS < hourMS) {
    return rtf.format(-1 * Math.floor(differenceMS / minuteMS), 'minute');
  } else if (differenceMS < dayMS) {
    return rtf.format(-1 * Math.floor(differenceMS / hourMS), 'hour');
  } else {
    return parsedDate.toLocaleString();
  }
};

/**
 * @param {T} oldObject Original object
 * @param {T} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export const getUpdatedValues = <T>(oldObject: T, newObject: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in newObject) {
    if (newObject[key] !== oldObject[key]) {
      result[key] = newObject[key];
    }
  }

  return result;
};

/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export const testString = (regex: RegExp, payload: string): boolean => {
  return new RegExp(regex).test(payload);
};

/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
export const getErrorText = (error?: unknown, lang: string = 'en'): string => {
  const t = getT(lang);

  if (!(error instanceof Object)) {
    return t.unknownError;
  }

  if (
    ('status' in error && error.status === 429) ||
    ('statusCode' in error && error.statusCode === 429)
  ) {
    return t.tooManyRequests;
  }

  let obj = error;

  if ('data' in obj && obj.data instanceof Object) {
    obj = obj.data;
  }

  if ('message' in obj) {
    if (obj.message instanceof Array) {
      return obj.message.join('.\r\n').concat('.');
    } else if (typeof obj.message === 'string') {
      return obj.message;
    }
  }

  return t.unknownError;
};

/**
 * @param {string} href Checked link
 * @param {IMenuItem} navTree Navigation tree
 * @returns {boolean} true if link found in the navigation tree
 */
export const checkActiveLink = (href: string, navTree: IMenuItem): boolean => {
  if (navTree.href) {
    if (
      href === navTree.href ||
      href.startsWith(`${navTree.href}/`) ||
      href.startsWith(`${navTree.href}?`)
    ) {
      return true;
    }
  }

  if (navTree.childs) {
    return navTree.childs.some((nav) => checkActiveLink(href, nav));
  }

  return false;
};

/**
 * @param {string} googleClientId Google Client ID
 * @param {string} redirectUri URI to redirect to after login
 * @param {string} state Random string for security
 * @returns {boolean} Google Login URL
 */
export const getGoogleSignInUrl = (
  googleClientId: string,
  redirectUri: string,
  state: string,
): string => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${encodeURIComponent(googleClientId)}`;
  url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += `&scope=${encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.profile',
  )}`;
  url += `&state=${encodeURIComponent(state)}`;
  url += '&include_granted_scopes=true';
  url += '&response_type=token';

  return url;
};

/**
 * @param {unknown} object The object from which the field is extracted
 * @param {string} field Field name
 * @returns {T | undefined} Field value or nothing
 */
export const getField = <T = unknown>(
  object: unknown,
  field: string,
): T | undefined => {
  if (typeof object === 'object' && object !== null && field in object) {
    return object[field as keyof object] as T;
  }

  return undefined;
};

/**
 * @param {IResListMeta} resMeta Metadata from the list-response
 * @returns {IReqList} Request parameters
 */
export const resListMetaToReq = <T = unknown, S = T, F = T>(
  resMeta: IResListMeta<T, S, F>,
): IReqList<S> & Record<string, unknown> => {
  return {
    reqPage: resMeta.page,
    reqLimit: resMeta.limit,
    reqSortField: resMeta.sort?.field,
    reqSortOrder: resMeta.sort?.order,
    ...resMeta.filters,
  };
};

/**
 * @param {object} options Options for creating search parameters
 * @returns {URLSearchParams} Search parameters
 */
export const createSearchParams = ({
  data,
  exclude,
  searchParams,
}: {
  data: object;
  exclude?: string[];
  searchParams?: string[][] | Record<string, string> | string | URLSearchParams;
}): URLSearchParams => {
  const newParams = new URLSearchParams(searchParams);

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === '' || exclude?.includes(key)) {
      return;
    }

    newParams.set(key, String(value));
  });

  return newParams;
};

export const buildRoutes = <T extends Record<string, unknown>>(
  tree: T,
  parent = '',
): TRoutes<T> => {
  const result: Record<string, unknown> = {};
  let base = tree['_'] === '/' ? '' : String(tree['_'] ?? '');

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
      result[key] = buildRoutes(value as Record<string, unknown>, base);
    } else if (typeof value === 'function') {
      result[key] = (...args: unknown[]) => {
        let fixedValue = value(...args);

        if (fixedValue[0] !== '/') {
          fixedValue = '/' + fixedValue;
        }

        return base + fixedValue;
      };
    } else {
      result[key] = base + (String(value)[0] !== '/' ? '/' : '') + value;
    }
  }

  return result as TRoutes<T>;
};
