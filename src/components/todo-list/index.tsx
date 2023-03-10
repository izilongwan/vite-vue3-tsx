import { defineComponent, ref } from 'vue'
import { IListData } from './data'
import { TodoListContent } from './TodoListContent'
import { TodoListInput } from './TodoListInput'

export default defineComponent({
  name: 'TodoList',

  setup() {
    const content = ref<string>('')
    const list = ref<IListData[]>([])

    return () => (
      <div class="todo-list">
        { <TodoListInput content={ content } list={ list } /> }

        { TodoListContent(list) }
      </div>
    )
  }
})
