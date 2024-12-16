import fs from 'node:fs'
import { parse } from 'es-module-lexer'
import esbuild from 'esbuild'

export function analyzeModule(src: string) {
  return parse(
    esbuild.transformSync(fs.readFileSync(src, 'utf-8'), {
      jsx: 'transform',
      format: 'esm',
      loader: 'tsx',
    }).code,
    src,
  )
}
