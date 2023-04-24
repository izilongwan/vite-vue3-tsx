import { Plugin } from 'vite'

export default function tplPlugin(): Plugin {
  return {
    // 插件名称
    name: 'vite:tpl',

    // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
    enforce: 'pre',

    // 代码转译，这个函数的功能类似于 `webpack` 的 `loader`
    transform(code, id, opt) {
      const SUFFIX_REG = /\.tpl$/

      if (!SUFFIX_REG.test(id)) {
        return code
      }

      return `
        export default {
          code: \`${ code }\`,
          render(data) {
            const VARIABLE_REG = /{{(.*?)}}/g
            function replace(key, data) {
              return key.split('.').reduce((p, c) => p?.[c], data)
            }
            return this.code.replace(VARIABLE_REG, (node, key) => replace(key, data))
          }
        }
      `
    }
  }
}

tplPlugin['default'] = tplPlugin
