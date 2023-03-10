import { ElMessage } from 'element-plus'
import { Ref } from 'vue'

export function addList(list: Ref<IListData[]>, content: Ref<string>, ) {
  if (!content.value) {
    ElMessage.warning('请输入todo信息')
    return
  }
  list.value.push({
    value: content.value,
    finish: false
  })
  content.value = ''
}

export function delItem(list: Ref<IListData[]>, index: number) {
  list.value.splice(index, 1)
}

export interface IListData {
  value: string
  finish: boolean
}
