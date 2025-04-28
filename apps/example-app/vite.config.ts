import path from 'node:path'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import UnoCSS from 'unocss/vite'
import solid from 'vite-plugin-solid'
import solidPagesPlugin from 'vite-plugin-solid-pages'

export default {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  css: {
    modules: false,
  },
  plugins: [
    mdx({
      jsxImportSource: 'solid-js/h',
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [rehypePrettyCode],
    }),
    UnoCSS(),
    solid(),
    solidPagesPlugin({
      dir: 'src/pages',
      extensions: ['tsx', 'mdx'],
    }),
  ],
}
