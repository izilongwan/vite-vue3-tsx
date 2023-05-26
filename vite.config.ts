import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import'
import tplPlugin from './plugin/tpl-plugin'
import { getProxyUrlMap } from './src/util/tool'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    plugins: [
      vue(),
      vueJsx(),
      styleImport({
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            ensureStyleFile: true,
            resolveStyle: (name) => {
              return `element-plus/lib/theme-chalk/${ name }.css`
            },
            resolveComponent: (name) => {
              return `element-plus/lib/${ name }`
            },
          },
        ],
      }),
      tplPlugin(),
    ],
    // base: mode === 'development' ? '/' : './',
    server: {
      port: 8888,
      proxy: getProxyUrlMap(env),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, '/src'),
      },
    },
    build: {
      sourcemap: true,
    }
  })
}
