import fs from 'fs-extra'
import matter from 'gray-matter'
import { normalizePath, type Plugin } from 'vite'
import { filePathToRoute, getPageFiles, getTitleFromPath } from './files'
import { filterExports } from './module'
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
      routeImports.push(`import ${componentName} from '${normalizePath(route.componentPath)}?pick=default&pick=style-imports&pick=side-effects';`)
    }
    if (route.hasConfig) {
      routeImports.push(`import {route as ${routeName}} from '${normalizePath(route.componentPath)}?pick=route';`)
    }
    else {
      routeImports.push(`const ${routeName} = {};`)
    }
    const componentStr = route.isLazy ? `lazy(() => import('${normalizePath(route.componentPath)}?pick=default&pick=style-imports&pick=side-effects'))` : componentName
    routeStrs.push(`{path: '${route.path}', component: ${componentStr}, info: ${JSON.stringify(route.info)}, ...${routeName}}`)
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

  const picksIds: Map<string, string[]> = new Map()

  return {
    name: 'vite-plugin-solid-pages',
    resolveId: {
      order: 'pre',
      handler(id) {
        if (id === VIRTUAL_ID) {
          return RESOLVED_ID
        }
        if (id === VIRTUAL_ROUTE_INFO_ID) {
          return RESOLVED_ROUTE_INFO_ID
        }

        const idQuery = id.split('?')[0]
        const query = new URLSearchParams(id.split('?')[1])
        const picks = query.getAll('pick')
        if (picks.length) {
          const resolvedId = idQuery.replace(/\?pick=.+/, '')
          const ext = resolvedId.split('.').pop()
          const withoutExt = resolvedId.replace(/\.\w+$/, '')
          const resolvedPath = `${withoutExt}$${picks.join('-')}.${ext}`
          picksIds.set(resolvedPath, picks)
          return resolvedPath
        }
      },
    },
    async buildStart() {
      const files = getPageFiles(dir, extensions)
      routes.length = 0
      picksIds.clear()

      for (const file of files) {
        const fileStat = fs.statSync(file)
        const info: any = {}
        info.date = fileStat.birthtime
        info.updated = fileStat.mtime
        info.title = getTitleFromPath(file)
        const route: any = {}
        route.info = info
        route.path = filePathToRoute(file, dir)
        const ids = await this.resolve(file)
        route.componentPath = ids?.id
        const content = fs.readFileSync(route.componentPath, 'utf-8')
        if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          const c = checkRouteFileStatus(content)

          if (!c.hasDefault) {
            continue
          }
          route.isLazy = c.isLazy
          route.hasConfig = c.hasConfig
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

      const picks = picksIds.get(id)
      if (!picks)
        return
      const originalPath = id.replace(/\$[^$]+$/, '')
      const ext = id.split('.').pop()
      const originnalId = `${originalPath}.${ext}`
      const code = fs.readFileSync(originnalId, 'utf-8')
      const newCode = filterExports(code, picks, ext as any)
      return newCode
    },

  }
}
