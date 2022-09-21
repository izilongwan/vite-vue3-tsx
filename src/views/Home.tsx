import { useStore, Dispatch } from 'vuex'
import { defineComponent, ref } from 'vue'
import { useRouter, Router } from 'vue-router'
import { SET_USER } from '@/store/login/actionType'
import BaseNav from '@/components/base-nav'
import TodoList from '@/components/TodoList'

import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'

// 函数式组件
const DropdownMenu = (dispatch: Dispatch, router: Router): JSX.Element => (
  <ElDropdownMenu>
    <ElDropdownItem
      { ...{
        onClick: () => {
          dispatch(`login/${ SET_USER }`, {})
          localStorage.removeItem('user')
          router.push({ name: 'login' })
        }
      } }
      icon="el-icon-switch-button"
    >
      退出登录
    </ElDropdownItem>
  </ElDropdownMenu>
)

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore()

    return () =>
    (
      <>
        <ElDropdown
          style={ {
            marginBottom: '15px'
          } }
          v-slots={ {
            dropdown: () => DropdownMenu(store.dispatch, router)
          } }
        >
          <span>
            <i
              class="el-icon-s-tools el-icon--right"
              style={ {
                marginRight: '8px'
              } }
            ></i>
            设置
          </span>
        </ElDropdown>

        <BaseNav />

        <TodoList />
      </>
    )
  }
})
