# vite-plugin-solid-pages

![npm](https://img.shields.io/npm/v/vite-plugin-solid-pages) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

> 🚧 working in progress

> A Vite plugin for SolidJS to generate file-based routes. Follow [solid-start](https://docs.solidjs.com/solid-start/building-your-application/routing) routing rules. But we only focused on SPA.

## Features

- [x] File-based routing
- [x] In-file route configuration
- [x] Code split into route-config and route-component automatically
- [x] Lazy or eager component configuration for each route
- [x] Auto generate route-info for each route, access via `vurtual:route-info`
- [x] Support mdx out of the box, auto decode frontmatter into route-info

## Quick Start

```bash
pnpm add vite-plugin-solid-pages -D
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidPages from 'vite-plugin-solid-pages'

export default defineConfig({
  plugins: [
    solidPlugin(),
    solidPages({
      dir: 'src/pages',
      extensions: ['tsx'],
    })
  ]
})
```

```ts
// src/env.d.ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-solid-pages/client" />
```

```tsx
// src/index.tsx
import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'

import routes from 'virtual:pages'

render(() => (
  <Router>
    {routes}
  </Router>
), document.getElementById('root')!)
```
