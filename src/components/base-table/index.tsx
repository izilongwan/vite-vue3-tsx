import { ElPagination, ElTable } from 'element-plus'
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import BaseTableColumns from './Columns'
import {
  FilterParam,
  formatPaginationMethod,
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
      pagination: formatPaginationMethod(prop.option.pagination),
    })

    return {
      ...toRefs(state),
    }
  },

  render() {
    const { columns, ...other } = this.$props.option
    const { pagination } = this
    const tableOption = {
      ...other,
      onFilterChange: onFormatFilterChange(this.$props.option) as (param: FilterParam) => void,
      onSortChange: onFormatSortChange(this.$props.option)
    }

    return (
      <>
        <ElTable { ...tableOption }>
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
      </>
    )
  }
})
