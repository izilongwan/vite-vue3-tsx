import { defineComponent } from 'vue'
import BaseNav from './base-nav'
import Setting from './setting'
import style from './index.module.less'

export default defineComponent({
  name: 'BaseHeader',

  setup(prop, { emit, slots }) {
    return {

    }
  },

  render() {
    return (
      <header class={ style.header }>
        <BaseNav class={ style.nav } />

        <Setting class={ style.setting } />
      </header>
    )
  },
})
