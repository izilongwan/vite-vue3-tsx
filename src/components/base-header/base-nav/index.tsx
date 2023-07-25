import { ElMenu, ElMenuItem, ElSubmenu } from 'element-plus'
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getRoutes } from './data'

export default defineComponent({
  name: 'BaseNav',

  setup() {
    const store = useStore()
    const route = useRoute()
    const state = reactive({
      a: 1,
      b: [],
      activePath: '',
    })

    const menus = computed(() => getRoutes(store.state.routes))

    onMounted(() => {
      changeAvtivePath(route.path)
    })

    function changeAvtivePath(activePath: string) {
      Object.assign(state, { activePath })
    }

    function onSelect(key: string, keyPath: string[]) {
      changeAvtivePath(key)
    }

    return {
      menus,
      onSelect,
      ...toRefs(state),
    }
  },

  render() {
    const { menus, activePath, onSelect } = this

    return (
      <ElMenu
        default-active={ activePath }
        mode="horizontal"
        router
        { ...{ onSelect } }
      >
        {
          menus.map(m => (
            m?.children.length > 0
              ? (
                <ElSubmenu index={ m.path } key={ m.path } title={ m.name }>
                  {
                    m.children.map(c =>
                      <ElMenuItem index={ c.path } key={ c.path }>
                        { c.name }
                      </ElMenuItem>
                    )
                  }
                </ElSubmenu>
              )
              : (
                <ElMenuItem index={ m.path } key={ m.path }>
                  { m.name }
                </ElMenuItem>
              )
          ))
        }
      </ElMenu>
    )
  }
})
