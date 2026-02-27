import * as fs from 'fs';

/**
 * @param {string} path Path to file with secret
 * @returns {string | undefined} File contents or undefined
 */
export const readSecret = (path: string): string => {
  return fs.readFileSync(path, 'utf8').trim();
};
