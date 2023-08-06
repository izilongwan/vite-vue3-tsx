import { ApiCodeDetail } from '@/api'
import { ArrowLeftBold, CircleCheck, Refresh } from '@element-plus/icons-vue'
import { ElButton, ElInput, ElRadio, ElRadioGroup, ElTag } from 'element-plus'
import { defineComponent, PropType, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Json } from './data'

const TEXTAREA_ARR = ['apiSql', 'extraJson', 'defaultJson']

export default defineComponent({
  name: 'ApiCodeDetailContent',

  props: {
    data: {
      type: Object as PropType<ApiCodeDetail>,
      default: () => ({})
    },
    updateApiCodeDetail: Function as PropType<(v: ApiCodeDetail) => void>,
    getApiCodeDetail: Function as PropType<() => void>
  },

  setup(prop, { emit, slots }) {
    function onInputChange(key: string, value: string) {
      setDataKeyValue(key, value)
    }

    function setDataKeyValue(key: string, value: string | number) {
      Object.assign(prop.data, { [key]: value })
    }

    return {
      onRadioChange: setDataKeyValue,
      onInputChange,
    }
  },

  render() {
    const { updateApiCodeDetail, getApiCodeDetail } = this.$props
    const { onRadioChange, onInputChange } = this
    const { infoJson = '{}', ...data } = this.$props.data
    const json = JSON.parse(infoJson) as Json

    const router = useRouter()

    return (
      <fieldset>
        <legend>
          <ElButton size="mini" onClick={ () => router.go(-1) }><ArrowLeftBold />返 回</ElButton>
          <ElButton size="mini" onClick={ () => getApiCodeDetail?.() }><Refresh />刷新</ElButton>
        </legend>

        <ElButton class="save_btn" type="primary" size="mini" circle onClick={ updateApiCodeDetail } >
          <CircleCheck /> SAVE
        </ElButton>
        {
          Object.entries(data).map((data) => renderItem({ data, json, onRadioChange, onInputChange }))
        }
      </fieldset >
    )
  },
})

interface Prop {
  data: [string, string | number]
  json: Json,
  onRadioChange: (k: string, v: number | string) => void
  onInputChange: (k: string, v: string) => void
}

function renderItem({ data, json, onRadioChange, onInputChange }: Prop) {
  const [k, v] = data
  let value
  const option = {
    rows: 30,
    onInput: (value: string) => onInputChange(k, value)
  }

  if (['output', 'state', 'apiType'].includes(k)) {
    const { radioMap } = json
    const list = radioMap[k as keyof typeof radioMap]

    value = (
      <ElRadioGroup modelValue={ v } onChange={ (v: number | string) => onRadioChange(k, v) }>
        {
          list.map(({ label, text }) =>
            <ElRadio label={ label }>{ text }</ElRadio>)
        }
      </ElRadioGroup>
    )
  } else if (TEXTAREA_ARR.includes(k)) {
    value = <ElInput type="textarea" style="width: 100%;" modelValue={ v } { ...option } />
  } else if (k === 'apiCode') {
    value = <ElTag type="success">{ v }</ElTag>
  } else if (k === 'description') {
    value = <ElInput type="text" modelValue={ v } { ...option } />
  } else {
    value = <div>{ v }</div>
  }

  return (
    <fieldset>
      <legend><span style="font-weight: bold; color: #444;">{ json.textMap?.[k] }</span>  [{ k }]</legend>
      { value }
    </fieldset>
  )
}
