import { useLoading } from '@/hook'
import { ElPagination, ElTable } from 'element-plus'
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import BaseTableColumns from './Columns'
import {
  formatPaginationMethod,
  getApiCodeAction,
  onFormatFilterChange,
  onFormatSortChange
} from './data'
import style from './index.module.less'

export default defineComponent({
  name: 'BaseTable',

  props: {
    option: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    }
  },

  setup(prop, { emit, slots }) {
    const state = reactive({
      pagination: formatPaginationMethod(prop.option.pagination, getTableData),
    })
    const [wrapRef, setLoading] = useLoading()

    function getTableData() {
      getApiCodeAction(prop.option, setLoading)
    }

    return {
      ...toRefs(state),
      wrapRef,
      getTableData,
    }
  },

  render() {
    const { getTableData } = this
    const { option } = this.$props
    const { columns, ...other } = option
    const { pagination } = this
    const tableOption = {
      ...other,
      onFilterChange: onFormatFilterChange(option, getTableData),
      onSortChange: onFormatSortChange(option, getTableData)
    }

    return (
      <div ref={ ref => this.wrapRef = ref }>
        <ElTable { ...tableOption as any }>
          <BaseTableColumns
            columns={ columns as Record<string, unknown>[] }
            pagination={ pagination }
            onFilterChange={ tableOption.onFilterChange }
          />
        </ElTable>

        { pagination.total > 0 ? (
          <ElPagination
            class={ style['base_table__pagination'] }
            background
            page-sizes={ [10, 20, 50, 100] }
            layout="total, sizes, prev, pager, next, jumper"
            { ...pagination }
          />
        ) : null }
      </div>
    )
  }
})
