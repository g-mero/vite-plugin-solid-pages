import { readFileSync, statSync } from 'node:fs'
import matter from 'gray-matter'
import { normalizePath, type Plugin } from 'vite'
import { filePathToRoute, getPageFiles, getTitleFromPath } from './files'
import { checkRouteFileStatus } from './route-config'

const defaultExts = ['mdx']
const defaultDir = 'src/pages'

function genClientCode(routes: any[]) {
  const routeStrs: string[] = []
  const routeImports: string[] = []

  routes.forEach((route, i) => {
    const routeName = `route$${i}`
    const componentName = `${routeName}$default`
    if (!route.isLazy) {
      routeImports.push(`import ${componentName} from '${normalizePath(route.componentPath)}';`)
    }
    const componentStr = route.isLazy ? `lazy(() => import('${normalizePath(route.componentPath)}'))` : componentName
    routeStrs.push(`{path: '${route.path}', component: ${componentStr}, info: ${JSON.stringify(route.info)}}`)
  })

  return `
  import { lazy } from 'solid-js';

  ${routeImports.join('\n')}

  const routes = [
    ${routeStrs.join(',\n')}
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
  const shouldPureIds: string[] = []

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
      shouldPureIds.length = 0

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
        shouldPureIds.push(route.componentPath)
        const content = readFileSync(route.componentPath, 'utf-8')
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          const c = checkRouteFileStatus(content)

          if (!c.hasDefault) {
            continue
          }
          route.isLazy = c.isLazy
        }
        else if (file.endsWith('.mdx')) {
          const data = matter(content)
          route.info = Object.assign(info, data.data)
        }
        routes.push(route)
      }
    },

    load(id) {
      if (id === RESOLVED_ID) {
        const code = genClientCode(routes)
        return code
      }
      if (id === RESOLVED_ROUTE_INFO_ID) {
        return `export default ${JSON.stringify(routes.map(r => ({ info: r.info, path: r.path })))}`
      }
    },
  }
}
