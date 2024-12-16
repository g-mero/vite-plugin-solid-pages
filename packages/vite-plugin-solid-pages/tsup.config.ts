/* eslint-disable node/prefer-global/process */
import fs from 'node:fs/promises'
import path from 'node:path'
// tsup.config.ts
import { defineConfig, type Options } from 'tsup'

async function copyFile(sourcePath: string, destPath: string) {
  try {
    // 复制文件
    await fs.copyFile(sourcePath, destPath)
  }
  catch (err) {
    console.error('Error copying', err)
  }
}

function generateConfig(opt: Options, jsx: boolean): Options {
  return {
    target: 'esnext',
    platform: 'node',
    format: ['cjs', 'esm'],
    clean: false,
    dts: !jsx,
    entry: ['src/index.ts'],
    outDir: 'dist/',
    treeshake: { preset: 'smallest' },
    replaceNodeEnv: true,
    esbuildOptions(options) {
      if (!opt.watch) {
        options.drop = ['console', 'debugger']
      }
    },
    onSuccess: async () => {
      const sourcePath = path.join(process.cwd(), 'src', 'client.d.ts')
      const destPath = path.join(process.cwd(), 'dist', 'client.d.ts')

      await copyFile(sourcePath, destPath)
      console.log('client.d.ts copied to dist')
    },
  }
}

export default defineConfig(options => [generateConfig(options, false)])
