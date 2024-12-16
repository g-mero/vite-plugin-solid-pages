import path from 'node:path'
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
  plugins: [UnoCSS(), solid(), solidPagesPlugin({
    dir: 'src/pages',
    extensions: ['tsx'],
  })],
}
