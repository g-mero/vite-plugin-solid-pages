import fs from 'fs-extra'

function cpy(source, dst) {
  fs.copyFileSync(source, dst)
}

function rebuildPkg() {
  const pkg = fs.readJsonSync('package.json')
  delete pkg.scripts
  delete pkg.devDependencies
  pkg.files = ['*']
  const exports = JSON.stringify(pkg.exports)
  pkg.exports = JSON.parse(exports.replaceAll('dist/', ''))
  pkg.main = pkg.main.replace('dist/', '')
  pkg.module = pkg.module.replace('dist/', '')
  pkg.types = pkg.types.replace('dist/', '')
  fs.writeJsonSync('dist/package.json', pkg, { spaces: 2 })
}

function preBuild() {
  cpy('src/client.d.ts', 'dist/client.d.ts')
  cpy('../../README.md', 'dist/README.md')
  rebuildPkg()
}

preBuild()
