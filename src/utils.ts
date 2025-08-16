import path from 'node:path';

const windowsSlashRE = /\\/g;
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/');
}
const postfixRE = /[?#].*$/;
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, '');
}
export const isWindows =
  // eslint-disable-next-line node/prefer-global/process
  typeof process !== 'undefined' && process.platform === 'win32';

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

export function strIsInclude<T extends readonly string[]>(
  strs: T,
  str?: string
): str is T[number] {
  return strs.includes(str || '');
}
