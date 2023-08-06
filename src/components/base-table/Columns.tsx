import { ElTableColumn } from 'element-plus'
import { RenderRowData } from 'element-plus/lib/el-table/src/table/defaults'
import { defineComponent, PropType } from 'vue'
import BaseTableColumns from './Columns'
import ColumnLabel from './ColumnLabel'
import { FilterParam } from './data'

export default defineComponent({
  name: 'BaseTableColumns',

  props: {
    columns: Array as PropType<Record<string, any>[]>,
    pagination: Object as PropType<Record<string, number>>,
    onFilterChange: Function as PropType<(filterObj: FilterParam) => void>
  },

  setup(prop, { emit, slots }) {
    return {}
  },

  render() {
    const { columns = [], pagination, onFilterChange = (e) => { } } = this.$props
    const { currentPage, pageSize } = pagination!

    return columns.map((c) =>
      c.children?.length ? (
        <ElTableColumn
          { ...c }
          key={ c.prop }
          label={
            <ColumnLabel
              column={ c }
              onFilterChange={ onFilterChange }
            /> }>
          <>
            <BaseTableColumns
              columns={ c.children as Record<string, object>[] }
            />
          </>
        </ElTableColumn>
      ) : (
        <ElTableColumn
          { ...c }
          key={ c.prop }
          label={
            <ColumnLabel
              column={ c }
              onFilterChange={ onFilterChange }
            /> }>
          { (data: RenderRowData<any>) =>
            renderTableColumn(data, c, (currentPage - 1) * pageSize)
          }
        </ElTableColumn>
      )
    )
  }
})

function renderTableColumn(data: RenderRowData<any>, column: Record<string, any>, baseNum: number) {
  if (column.slots?.default) {
    return column.slots.default?.(data.row, column.prop, data, column)
  }

  if (column.prop === 'index') {
    return baseNum + data.$index + 1
  }

  return data.row[column.prop]
}
