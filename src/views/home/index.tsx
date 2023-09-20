import BaseHeader from '@/components/base-header'
import style from '@/style/home.module.less'
import { defineComponent, KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {

    return () =>
    (
      <div class={ style.base_page }>
        <BaseHeader />

        <RouterView>
          {
            ({ Component }: { Component: typeof RouterView }) =>
              <KeepAlive>
                <Component class={ style.base_page__container } />
              </KeepAlive>
          }
        </RouterView>
      </div>
    )
  }
})
