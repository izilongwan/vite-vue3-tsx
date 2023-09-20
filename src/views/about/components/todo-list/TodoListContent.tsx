import { ElButton, ElCheckbox, ElEmpty, ElScrollbar } from 'element-plus'
import { Ref } from 'vue'
import { delItem, IListData } from './data'

export function TodoListContent(list: Ref<IListData[]>) {
  return (
    <ElScrollbar height="400px">
      { list.value.length === 0
        ? (<ElEmpty />)
        : (
          list.value.map((data, index) => (
            <div
              class="list-item"
              style={ { textDecoration: data.finish ? 'line-through' : 'none' } }
              key={ index }
            >
              <ElCheckbox v-model={ data.finish }>完成</ElCheckbox>
              { data.value }
              <ElButton
                round
                size="mini"
                type="danger"
                class="el-icon-delete"
                icon="el-icon-delete"
                { ...{ onClick: () => delItem(list, index) } }
              >
                删除
              </ElButton>
            </div>
          ))
        ) }
    </ElScrollbar>
  )
}
