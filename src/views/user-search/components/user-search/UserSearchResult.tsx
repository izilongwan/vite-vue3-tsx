import { defineComponent, PropType } from 'vue'
import { Datas } from './data'
import styles from './index.module.less'

const UserSearchResult = defineComponent({
  name: 'UserSearchResult',

  props: {
    data: {
      type: Array as PropType<Datas>,
      default: () => ([]),
    }
  },

  render() {
    const { data } = this.$props

    return (
      <ul>
        {
          data.map((o, idx) => (
            <li key={ idx }>
              <span class={ styles.cell }>id: { o.id }</span> |
              <span class={ styles.cell }>age: { o.age }</span> |
              <span class={ styles.cell }>name: { o.name }</span>
              {
                o.children && <UserSearchResult data={ o.children } />
              }
            </li>
          ))
        }
      </ul>
    )
  },
})

export default UserSearchResult
