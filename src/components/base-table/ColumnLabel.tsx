import { ArrowDown } from '@element-plus/icons-vue'
import { ElButton, ElInput, ElPopover } from 'element-plus'
import {
  defineComponent,
  nextTick,
  PropType,
  reactive,
  Ref,
  ref,
  toRefs
} from 'vue'
import { FilterParam } from './data'

export default defineComponent({
  name: 'ColumnLabel',

  props: {
    column: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    onFilterChange: Function as PropType<(param: FilterParam) => void>,
    filterObj: Object as PropType<FilterParam>,
    setFilterObj: Function as PropType<(filterObj: FilterParam) => void>
  },

  setup(prop, { emit, slots }) {
    const popperRef = ref()
    const state = reactive({
      inputValue: '',
      hasSearch: false
    })

    const inputOption = {
      placeholder: '请输入搜索值',
      onInput,
      onkeydown: save
    }

    const filterOption = {
      style: {
        width: '10px',
        cursor: 'pointer',
        'vertical-align': 'middle'
      }
    }

    const slot = {
      reference: () => <ArrowDown { ...filterOption } />,
      default: () => {
        return (
          <>
            <ElInput
              type="text"
              modelValue={ state.inputValue }
              { ...inputOption }
            />

            <ElButton
              style="margin-top: 10px"
              size="mini"
              type="primary"
              plain
              onClick={ () => submitFilterParam(state.inputValue) }>
              确 定
            </ElButton>

            <ElButton
              style="margin-top: 10px"
              size="mini"
              plain
              onClick={ () => submitFilterParam('') }>
              清 除
            </ElButton>
          </>
        )
      }
    }

    function save(e: Event) {
      if ((e as KeyboardEvent).code !== 'Enter') {
        return
      }

      submitFilterParam((e.target as HTMLInputElement).value)
    }

    function submitFilterParam(value: string) {
      prop.onFilterChange?.({
        [prop.column.prop]: value
      })
      Object.assign(state, { hasSearch: Boolean(value) })
      hide()
    }

    function onInput(inputValue: string) {
      Object.assign(state, { inputValue })
    }

    function hide() {
      popperRef.value?.hide?.()
    }

    return {
      slot,
      popperRef,
      state
    }
  },

  render() {
    const { slot, state } = this
    const { panelType, label } = this.column
    const content = typeof label === 'function' ? label?.() : label
    const option = {
      width: 200,
      onHide() {
        !state.hasSearch && Object.assign(state, { inputValue: '' })
      },
      onShow: () => {
        nextTick(() =>
          this.popperRef.popperRef.querySelector('input')?.focus()
        )
      }
    }

    const contentOption = {
      style: Object.assign(state.hasSearch ? { color: '#409eff' } : {})
    }

    return panelType === 'search' ? (
      <>
        <span { ...contentOption }>{ content }</span>
        <ElPopover
          v-slots={ slot }
          { ...option }
          ref={ (ref) => (this.popperRef = ref) }></ElPopover>
      </>
    ) : (
      <span>{ content }</span>
    )
  }
})
