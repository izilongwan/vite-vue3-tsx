import { computed, defineComponent, reactive, toRefs } from 'vue'
import { RouteRecord, RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { getRoutes } from './data'
import styles from './index.module.less'

export default defineComponent({
  name: 'BaseNav',

  setup() {
    const store = useStore()
    const state = reactive({
      a: 1,
      b: [],
    })

    const menus = computed(() => getRoutes(store.state.routes) as RouteRecord[])

    return {
      menus,
      ...toRefs(state),
    }
  },

  render() {
    const { menus } = this

    return (
      <ul>
        {
          menus.map(item => (
            <li class={ styles.item }>
              <RouterLink to={ item.path }>{ item.name }</RouterLink>
            </li>
          ))
        }
      </ul>
    )
  }
})
