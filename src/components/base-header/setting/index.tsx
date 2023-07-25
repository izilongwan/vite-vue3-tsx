import { useStore, Dispatch } from 'vuex'
import { defineComponent } from 'vue'
import { useRouter, Router } from 'vue-router'
import { SET_USER } from '@/store/login/actionType'

import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'
import { addRoute, removeRoute } from '@/router'

// 函数式组件
const DropdownMenu = (dispatch: Dispatch, router: Router): JSX.Element => (
  <ElDropdownMenu>
    <ElDropdownItem
      { ...{ onClick: addRoute } }
      icon="el-icon-plus"
    >
      添加【search】路由
    </ElDropdownItem>
    <ElDropdownItem
      { ...{ onClick: removeRoute } }
      icon="el-icon-minus"
    >
      移除【search】路由
    </ElDropdownItem>
    <ElDropdownItem
      { ...{ onClick: () => logout(dispatch, router) } }
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
      <ElDropdown
        v-slots={ { dropdown: () => DropdownMenu(store.dispatch, router) } }
      >
        <span>
          <i
            class="el-icon-s-tools el-icon--right"
            style={ { marginRight: '8px' } }
          ></i>
          设置
        </span>
      </ElDropdown>
    )
  }
})

function logout(dispatch: Dispatch, router: Router) {
  dispatch(`login/${ SET_USER }`, {})
  localStorage.removeItem('user')
  router.push({ name: 'login' })
  removeRoute()
}
