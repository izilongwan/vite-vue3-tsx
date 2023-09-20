import { defineComponent, PropType, ref } from 'vue'

const EVENT = 'changeSearchKey'

export default defineComponent({
  name: 'UserSearchInput',

  emits: [EVENT],

  props: {
    onChangeSearchKey: Function as PropType<(v: string) => void>
  },

  setup(props, { emit }) {
    const searchKey = ref('')

    function onInput(e: Event) {
      const value = (e.target as HTMLInputElement).value

      searchKey.value = value

      emit(EVENT, value)
    }

    return {
      searchKey,
      onInput,
    }
  },

  render() {
    const { onInput } = this

    return (
      <div>
        <input type="text" onInput={ onInput } />
      </div>
    )
  },
})
