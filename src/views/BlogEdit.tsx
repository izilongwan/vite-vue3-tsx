import { addBlogDetail, BlogDetail, getBlogDetail, updateBlogDetail } from '@/api'
import style from '@/style/blog_edit.module.less'
import { ArrowLeftBold, CircleCheck } from '@element-plus/icons-vue'
import { ElButton, ElMessage } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/src/style/less/index.less'
import { defineComponent, InputHTMLAttributes, onActivated, onDeactivated, onMounted, onUnmounted, reactive, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface State {
  code: string
  data: BlogDetail
}

export default defineComponent({
  name: 'BlogEdit',

  setup(prop, { emit, slots }) {
    const route = useRoute()
    const router = useRouter()
    const state = reactive<State>({
      code: route.params.code as string,
      data: { author: 'izilong', } as BlogDetail,
    })

    const vditorRef = shallowRef()

    onMounted(() => {
      vditorRef.value = new Vditor('vditor', {
        height: 500,
        cache: { enable: false, },
        mode: 'sv',
        placeholder: 'Write something',
        preview: {
          hljs: {
            enable: true
          }
        },
      })
    })

    onActivated(() => {
      Object.assign(state, { code: route.params.code })
      state.code && getBlogDetail(state.code).then(([data]) => {
        Object.assign(state, { data })
        const { mdText } = state.data

        mdText && setTimeout(() => {
          vditorRef.value.setValue(mdText)
        }, 200)
      })

    })

    onDeactivated(() => vditorRef.value.setValue(''))

    onUnmounted(() => vditorRef.value.destroy())

    function addOrSaveMd() {
      const mdText = vditorRef.value.getValue()

      Object.assign(state.data, { mdText })

      const callback = state.code ? updateBlogDetail : addBlogDetail

      callback(state.data).then(data => {
        data >= 1
          ? ElMessage({ message: 'ok', type: 'success' })
          : ElMessage({ message: 'fail', type: 'warning' })
      })
    }

    function valueChange(e: Event, prop: keyof BlogDetail) {
      state.data[prop] = (e.target as InputHTMLAttributes).value
    }

    return { state, router, addOrSaveMd, valueChange }
  },

  render() {
    const { router, addOrSaveMd, state, valueChange } = this
    const { data } = state

    return (
      <div class={ style.container }>
        <fieldset>
          <legend onClick={ () => router.push('/blog') }>
            <ElButton size="mini"><ArrowLeftBold />返 回</ElButton>
          </legend>

          <fieldset>
            <legend>UPDATETIME</legend>
            <div>{ data.updateTime }</div>
          </fieldset>

          <fieldset>
            <legend>AUTHOR</legend>
            <div>{ data.author }</div>
          </fieldset>

          <fieldset>
            <legend>TITLE</legend>
            <input value={ data.title } onChange={ e => valueChange(e, 'title') } class={ style.title_input } type="text" />
          </fieldset>

          <fieldset>
            <legend>DESCRIPTION</legend>
            <textarea
              value={ data.description }
              onChange={ e => valueChange(e, 'description') }
              class={ style.description_area }
              rows="3" />
          </fieldset>

          <fieldset>
            <legend>CONTENT</legend>
            <div id="vditor" class={ style.vditor } />
          </fieldset>


          <ElButton class={ style.save_btn } type="primary" size="mini" onClick={ addOrSaveMd } circle>
            <CircleCheck /> SAVE
          </ElButton>
        </fieldset>

      </div>
    )
  },
})
