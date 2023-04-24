import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport from 'vite-plugin-style-import'
import tplPlugin from './plugin/tpl-plugin'

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
      proxy: {
        [env.VITE_API_URL]: {
          target: env.VITE_API_PROXY_URL,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${ env.VITE_API_URL }`), ''),
        },
      }
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
