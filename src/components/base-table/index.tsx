import { useLoading } from '@/hook'
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
    const [wrapRef, setLoading] = useLoading()

    watch(() => prop.option?.loading, (v: boolean) => setLoading(v))

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
