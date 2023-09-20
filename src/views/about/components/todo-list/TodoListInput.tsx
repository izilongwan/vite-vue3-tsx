import foucsDirective from '@/directive/focus'
import { ElButton, ElInput } from 'element-plus'
import { defineComponent, PropType, Ref } from 'vue'
import { addList, IListData } from './data'

export const TodoListInput = defineComponent({
  props: {
    content: Object as PropType<Ref<string>>,
    list: Object as PropType<Ref<IListData[]>>,
  },

  directives: { focus: foucsDirective },

  render() {
    const { content, list } = this.$props

    if (!content || !list) {
      return null
    }

    return (
      <ElInput
        type="text"
        v-focus
        v-model={ content.value }
        v-slots={ TodoListInputButton(list, content) } />
    )
  }
})

function TodoListInputButton(list: Ref<IListData[]>, content: Ref<string>) {
  return {
    append: () => (
      <ElButton
        icon="el-icon-circle-plus-outline"
        { ...{ onClick: () => addList(list, content) } }
      >
        添加
      </ElButton>
    )
  }
}
