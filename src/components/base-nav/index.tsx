import { defineComponent, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { aNavData } from './data'
import styles from './index.module.less'

export default defineComponent({
  name: 'BaseNav',

  setup() {

    const state = reactive({
      a: 1,
      b: []
    })

    return state
  },

  render() {
    return (
      <ul>
        {
          aNavData.map(item => (
            <li class={ styles.item }>
              <RouterLink to={ item.to }>{ item.name }</RouterLink>
            </li>
          ))
        }
      </ul>
    )
  }
})
