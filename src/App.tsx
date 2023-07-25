import '@/style/base.less'
import { defineComponent, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup(props, ctx) {
    return () =>
      <RouterView>
        {
          ({ Component }: { Component: typeof RouterView }) => (
            <KeepAlive>
              <Component />
            </KeepAlive>
          )
        }
      </RouterView>
  }
})
