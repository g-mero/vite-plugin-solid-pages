// tsup.config.ts
import { defineConfig, type Options } from 'tsup'

function generateConfig(opt: Options): Options {
  return {
    target: 'esnext',
    platform: 'node',
    format: ['cjs', 'esm'],
    clean: !opt.watch,
    dts: true,
    entry: ['src/index.ts'],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    minify: !opt.watch,
    esbuildOptions(options) {
      if (!opt.watch) {
        options.drop = ['console', 'debugger']
      }
    },
  }
}

export default defineConfig(options => [generateConfig(options)])
