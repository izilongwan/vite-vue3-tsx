import { ElLoading, ElPagination, ElTable } from 'element-plus'
import { defineComponent, PropType, ref, watch } from 'vue'
import BaseTableColumns from './Columns'
import style from './index.module.less'

export default defineComponent({
  name: 'BaseTable',

  props: {
    option: Object as PropType<Record<string, any>>,
  },

  setup(prop, { emit, slots }) {

    const wrapRef = ref()
    const loadingRef = ref()

    watch(() => prop.option?.loading as boolean, (v) => changeLoadingState(v))

    function changeLoadingState(loading: boolean) {
      if (!loadingRef.value) {
        loading && (loadingRef.value = ElLoading.service({ target: wrapRef.value }))
        return
      }

      loadingRef.value?.close()
      loadingRef.value = null
    }

    return {
      wrapRef,
    }
  },

  render() {
    const { option = {} } = this.$props
    const { columns, pagination = {}, ...other } = option

    return (
      <div ref={ v => this.wrapRef = v }>
        <ElTable { ...other }>
          <BaseTableColumns columns={ columns as Record<string, unknown>[] } pagination={ pagination } />
        </ElTable>

        {
          pagination.total > 0
            ? <ElPagination
              class={ style['base_table__pagination'] }
              background
              page-sizes={ [10, 20, 50, 100] }
              layout="total, sizes, prev, pager, next, jumper"
              { ...pagination }
            />
            : null
        }

      </div>
    )
  },
})
