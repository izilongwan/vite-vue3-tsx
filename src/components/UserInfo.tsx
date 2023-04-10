import { defineComponent } from 'vue'
import {
  ElSkeleton,
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus'

export default defineComponent({
  name: 'UserInfo',

  props: {
    username: String,
    password: String,
  },

  render() {
    const { username } = this

    return username
      ? <ElDescriptions
        title="用户信息"
        style={ {
          padding: '10px 16px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'
        } }
      >
        <ElDescriptionsItem
          { ...{ label: '用户名' } }
        >
          { username }
        </ElDescriptionsItem>
        <ElDescriptionsItem
          { ...{ label: '密码' } }
        >
          { this.password }
        </ElDescriptionsItem>
      </ElDescriptions>
      : <ElSkeleton rows={ 5 } animated></ElSkeleton>
  }
})
