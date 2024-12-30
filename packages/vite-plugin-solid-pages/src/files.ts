import { join, relative } from 'node:path'

import fg from 'fast-glob'
import { normalizePath, slash } from './utils'

export function getTitleFromPath(filePath: string) {
  const parts = filePath.split('/')
  const finalPart = parts[parts.length - 1].replace(/\.[^.]+$/, '')
  if (finalPart === 'index') {
    return parts[parts.length - 2] || 'index'
  }
  return finalPart
}

function extsToGlob(extensions: string[]) {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

/**
 * Resolves the files that are valid pages for the given context.
 */
export function getPageFiles(path: string, extensions: string[]): string[] {
  const ext = extsToGlob(extensions)
  const pattern = `**/*.${ext}`

  const files = fg.sync(pattern, {
    onlyFiles: true,
    cwd: path,
  }).map(p => slash(join(path, p)))

  return files
}

/**
 * Converts a file path to a route path based on specified rules.
 * @param {string} filePath - The file path to convert.
 * @returns {string} - The corresponding route path.
 */
export function filePathToRoute(filePath: string, baseDir: string, basePath?: string): string {
  // Normalize and get the relative file path
  let routePath = normalizePath(relative(baseDir, filePath)).replace(/\.[^.]+$/, '') // Remove file extension

  // Handle special cases for route parameters and wildcard
  routePath = routePath
    .replace(/\[(\.\.\.)?(\w+)\]/g, (match, isWildcard, paramName) => {
      return isWildcard ? `*${paramName}` : `:${paramName}`
    }) // Replace [param] with :param and [...wildcard] with *wildcard
    .replace(/\/?index$/, '') // Convert /index to ''
    .replace(/\/\//g, '/') // Handle accidental double slashes

  // Ensure root route is returned as ``
  if (routePath === '/') {
    routePath = ''
  }

  return basePath ? `${basePath}${routePath}` : routePath
}
