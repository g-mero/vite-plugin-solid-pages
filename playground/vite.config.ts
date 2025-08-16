import path from 'node:path';
import mdx from '@mdx-js/rollup';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import solidPagesPlugin from '../src';

export default defineConfig({
  root: './playground',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, '../src')}/`,
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
      dir: './playground/src/pages',
      extensions: ['tsx', 'mdx'],
    }),
  ],
});
