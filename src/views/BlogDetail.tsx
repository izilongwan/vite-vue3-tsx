import { BlogDetail, getBlogDetail } from '@/api'
import 'progress-catalog/src/progress-catalog.css'
import Catalog from 'progress-catalog'
import style from '@/assets/blog_detail.module.less'
import { defineComponent, onActivated, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Vaditor from 'vditor'

interface State {
  code: string
  data: BlogDetail
}

export default defineComponent({
  name: 'BlogDetail',

  setup(prop, { emit, slots }) {
    const route = useRoute()
    const state = reactive<State>({
      code: route.params.code as string,
      data: {} as BlogDetail,
    })

    onActivated(() => {
      const { code } = route.params
      Object.assign(state, { code })

      code && getBlogDetail(state.code).then(([data]) => {
        Object.assign(state, { data })
        Vaditor.md2html(data.mdText)
          .then(text => Object.assign(state.data, { text }))
          .finally(() => {
            new Catalog({
              contentEl: 'content',
              catalogEl: 'aside',
              scrollWrapper: document.querySelector('#content'),
            })
          })
      })
    })
    return { state }
  },

  render() {
    const { data } = this.state
    const { text } = data

    return (
      <div class={ style.container }>
        <main class={ style.main }>
          <div id="content" class={ style.content } innerHTML={ text }></div>
          <aside id="aside" class={ style.aside }></aside>
        </main>
      </div>
    )
  },
})
