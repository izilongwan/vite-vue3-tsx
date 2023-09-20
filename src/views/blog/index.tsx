import { Blog, getBlogs } from '@/api'
import { useLoading } from '@/hook'
import style from '@/style/blog.module.less'
import { Edit, Refresh, View } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { defineComponent, onActivated, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Blog',

  setup(prop, { emit, slots }) {

    const state = reactive({
      list: [] as Blog[],
    })
    const [wrapRef, setLoading] = useLoading()

    const router = useRouter()

    const TAGS = ['SPAN', 'svg']

    onActivated(() => {
      getBlogAction()
    })

    function getBlogAction() {
      return getBlogs(setLoading).then(list => Object.assign(state, { list }))
    }

    function onItemClick(e: Event) {
      let target = e.target as HTMLElement

      while (TAGS.includes(target.tagName)) {
        target = target.parentElement!
      }

      const { id, type } = target.dataset

      id && router.push(`/blog-${ type }/${ id }`)
    }

    return {
      state,
      wrapRef,
      onItemClick,
      getBlogAction,
    }
  },

  render() {
    const { getBlogAction, state } = this
    const { list } = state

    return (
      <div class={ style.container } ref={ ref => this.wrapRef = ref }>
        <fieldset>
          <legend onClick={ getBlogAction }>
            <ElButton size="mini"><Refresh />刷 新</ElButton>
          </legend>


          <ul>
            {
              list.map(o => (
                <>
                  <li class={ style.cell }>
                    <ul class={ style.cell__item }>
                      {
                        Object.entries(o).sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0)).map(([k, v]) => (
                          <li>{ k }: { v }</li>
                        ))
                      }
                    </ul>

                    <div class={ [style.cell__item, style.center] } onClick={ this.onItemClick }>
                      <ElButton data-type="edit" data-id={ o.bId } type="primary" plain size="mini">
                        <Edit />编 辑
                      </ElButton>
                      <ElButton data-type="detail" data-id={ o.bId } size="mini" type="info">
                        <View />详 情
                      </ElButton>
                    </div>
                  </li>
                  <hr />
                </>
              ))
            }
          </ul>
        </fieldset>
      </div>)
  },
})
