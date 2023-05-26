import { Blog, getBlogs } from '@/api'
import { ElButton, } from 'element-plus'
import { Edit, View, Refresh } from '@element-plus/icons-vue'
import { defineComponent, onActivated, reactive } from 'vue'
import { useRouter } from 'vue-router'
import style from '@/assets/blog.module.less'

export default defineComponent({
  name: 'Blog',

  setup(prop, { emit, slots }) {

    const state = reactive({
      list: [] as Blog[],
    })

    const router = useRouter()

    const TAGS = ['SPAN', 'svg']

    onActivated(() => {
      getBlogAction()
    })

    function getBlogAction() {
      return getBlogs().then(list => Object.assign(state, { list }))
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
      onItemClick,
      getBlogAction,
    }
  },

  render() {
    const { getBlogAction, state } = this
    const { list } = state

    return (
      <div class={ style.container }>
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
