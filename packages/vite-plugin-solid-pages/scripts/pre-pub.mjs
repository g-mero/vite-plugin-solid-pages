/* eslint-disable node/prefer-global/process */
import fs from 'node:fs/promises'
import path from 'node:path'

async function copyFile(sourcePath, destPath) {
  try {
    // 确保 dist 目录存在
    await fs.mkdir(path.join(process.cwd(), 'dist'), { recursive: true })

    // 复制文件
    await fs.copyFile(sourcePath, destPath)
  }
  catch (err) {
    console.error('Error copying', err)
  }
}

async function copyPackageJson() {
  const sourcePath = path.join(process.cwd(), 'package.json') // 根目录下的 package.json
  const destPath = path.join(process.cwd(), 'dist', 'package.json') // 目标路径是 dist/package.json
  await copyFile(sourcePath, destPath)
  console.log('package.json copied to dist')
}

async function copyClientDeclareFile() {
  const sourcePath = path.join(process.cwd(), 'src', 'client.d.ts')
  const destPath = path.join(process.cwd(), 'dist', 'client.d.ts')

  await copyFile(sourcePath, destPath)
  console.log('client.d.ts copied to dist')
}

copyClientDeclareFile()
