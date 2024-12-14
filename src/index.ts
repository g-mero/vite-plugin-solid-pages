import { readFileSync, statSync } from 'node:fs'
import matter from 'gray-matter'
import { normalizePath, type Plugin } from 'vite'
import { filePathToRoute, getPageFiles, getTitleFromPath } from './files'

const defaultExts = ['mdx']
const defaultDir = 'src/pages'

function genClientCode(routes: any[]) {
  return `
  import { lazy } from 'solid-js';

  const routes = [
    ${routes.map(route => `
      {
        path: '${route.path}',
        component: lazy(() => import('${normalizePath(route.componentPath)}')),
        info: ${JSON.stringify(route.info)}
      }
    `).join(',')}
  ];

  export default routes;
`
}

export default function solidPagesPlugin(config?: {
  dir: string
  extensions: string[]
}): Plugin {
  const VIRTUAL_ID = 'virtual:pages'
  const RESOLVED_ID = `\0${VIRTUAL_ID}`
  const VIRTUAL_ROUTE_INFO_ID = 'virtual:route-info'
  const RESOLVED_ROUTE_INFO_ID = `\0${VIRTUAL_ROUTE_INFO_ID}`

  const { dir = defaultDir, extensions = defaultExts } = config || {}
  const routes: any[] = []

  return {
    name: 'vite-plugin-solid-pages',
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID
      }
      if (id === VIRTUAL_ROUTE_INFO_ID) {
        return RESOLVED_ROUTE_INFO_ID
      }
    },
    async buildStart() {
      const files = getPageFiles(dir, extensions)
      routes.length = 0

      for (const file of files) {
        const fileStat = statSync(file)
        const info: any = {}
        info.date = fileStat.birthtime
        info.updated = fileStat.mtime
        info.title = getTitleFromPath(file)
        const route: any = {}
        route.info = info
        route.path = filePathToRoute(file, dir)
        const ids = await this.resolve(file)
        route.componentPath = ids?.id
        if (file.endsWith('.mdx')) {
          const content = readFileSync(file, 'utf-8')
          const data = matter(content)
          route.info = Object.assign(info, data.data)
        }
        routes.push(route)
      }
    },

    load(id) {
      if (id === RESOLVED_ID) {
        return genClientCode(routes)
      }
      if (id === RESOLVED_ROUTE_INFO_ID) {
        return `export default ${JSON.stringify(routes.map(r => ({ info: r.info, path: r.path })))}`
      }
    },
  }
}
