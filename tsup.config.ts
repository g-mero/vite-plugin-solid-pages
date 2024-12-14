
// tsup.config.ts
import { defineConfig, type Options } from 'tsup'

function generateConfig(jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'node',
    format: ['cjs', 'esm'],
    clean: true,
    dts: !jsx,
    entry: ['src/index.ts'],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
  }
}

export default defineConfig([generateConfig(false)])
