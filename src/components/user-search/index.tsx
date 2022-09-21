import { defineComponent, reactive, toRefs, watch } from 'vue'
import UserSearchInput from './UserSearchInput'
import UserSearchResult from './UserSearchResult'
import { data, Datas } from './data'

export default defineComponent({
  name: 'UserSearch',

  setup() {
    const state = reactive({
      data,
      searchKey: '',
    })

    function onChangeSearchKey(value: string) {
      state.searchKey = value
    }

    function findData(data: Datas, value: string) {
      return data.reduce((p, c) => {
        const { id, name } = c

        if (String(id).includes(value) || name.includes(value)) {
          p.push(c)
        } else if (c.children) {
          p.push(...findData(c.children, value))
        }

        return p
      }, [] as Datas)
    }

    function watchSearchKeyChange(value: string) {
      state.data = findData(data, value)
    }

    watch(() => state.searchKey, watchSearchKeyChange)

    return {
      ...toRefs(state),
      onChangeSearchKey,
    }
  },

  render() {
    const { onChangeSearchKey, data } = this

    return (
      <fieldset>
        <legend>user-search</legend>

        <UserSearchInput onChangeSearchKey={ onChangeSearchKey } />

        <UserSearchResult data={ data } />
      </fieldset>
    )
  },
})
