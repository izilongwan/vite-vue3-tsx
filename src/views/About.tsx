import { SET_USER } from '@/store/login/actionType';
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Child from '@/components/Child';
import UserInfo from '@/components/UserInfo';
import BaseNav from '@/components/base-nav';

export default defineComponent({
  name: 'About',

  setup() {
    const password = ref<string>('')
    const store = useStore()
    const username = ref<string>('')

    setTimeout(() => {
      const userString = localStorage.getItem('user')
      if (userString) {
        const user = JSON.parse(userString)
        store.dispatch(`login/${ SET_USER }`, user)
      }
      username.value = store.state.login.user.name
      password.value = store.state.login.user.password.replace(/[\s\S]/g, '*')
    }, 1000)

    function onChangePswVisible(flag: boolean) {
      password.value = flag
        ? store.state.login.user.password
        : store.state.login.user.password.replace(/[\s\S]/g, '*')
    }

    return {
      password,
      store,
      username,
      onChangePswVisible,
    }
  },

  render() {
    const { username, onChangePswVisible } = this

    const userProps = {
      username,
      password: this.password
    }

    return (
      <div class="about-page">
        <BaseNav />

        <Child
          type="primary"
          size="small"
          v-slots={ {
            prefix: () => <i class="el-icon-star-on"></i>,
            suffix: (props: string) => <div>{ props }</div>
          } }
          onChangePswVisible={ onChangePswVisible }
        >
          这是一段默认插槽的内容
        </Child>

        <UserInfo { ...userProps } />

      </div>
    )
  }
})
