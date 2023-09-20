import { ApiCode } from '@/api'
import BaseTable from '@/components/base-table'
import { Refresh } from '@element-plus/icons-vue'
import { ElButton, ElTag } from 'element-plus'
import { defineComponent, onActivated, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'ApiCodeList',

	setup(prop, { emit, slots }) {
		const router = useRouter()
		const tableRef = ref()

		const tableOption = {
			data: [],
			columns: [
				{
					label: '序号',
					prop: 'index',
					type: 'index',
					width: 100,
				},
				{
					label: '编码',
					prop: 'apiCode',
					minWidth: 150,
					sortable: 'custom',
					panelType: 'search',
				},
				{
					label: '类型',
					prop: 'apiType',
					minWidth: 120,
					columnKey: 'apiType',
					filters: [
						{
							text: '查询 [QUERY]',
							value: 'QUERY'
						},
						{
							text: '更新 [UPDATE]',
							value: 'UPDATE'
						},
						{
							text: '新增 [INSERT]',
							value: 'INSERT'
						},
						{
							text: '删除 [DELETE]',
							value: 'DELETE'
						}
					],
					slots: {
						default(row: ApiCode, prop: string) {
							return (
								<ElTag type="warning">{ row[prop as keyof typeof row] }</ElTag>
							)
						}
					}
				},
				{
					label: '描述',
					prop: 'description',
					minWidth: 120,
					panelType: 'search',
				},
				{
					label: '状态',
					prop: 'stateTxt',
					minWidth: 120,
					columnKey: 'state',
					filters: [
						{ text: '已启用', value: 1 },
						{ text: '已停用', value: 0 },
					],
					slots: {
						default: (row: ApiCode) => {
							const { state, stateTxt } = row
							return (
								<ElTag type={ state == 1 ? 'success' : 'danger' }>{ stateTxt }</ElTag>
							)
						}
					}
				},
				{
					label: '更新时间',
					prop: 'updateTime',
					minWidth: 180,
					panelType: 'search',
					sortable: 'custom',
				},
				{
					label: '操作',
					prop: 'operate',
					width: 160,
					fixed: 'right',
					slots: {
						default: (row: ApiCode, prop: string) => {
							const { state } = row
							return (
								<>
									<ElButton type="primary" size="mini" data-type="code">详情</ElButton>
									<ElButton type={ state === 1 ? 'danger' : 'warning' } data-state={ state } size="mini">{ state === 1 ? '停用' : '启用' }</ElButton>
								</>
							)
						}
					}
				},
			],
			stripe: true,
			maxHeight: 610,
			onCellClick,
			apiCode: 'GET_API_CODE',
			param: {},
			// onSortChange: getApiCodeAction,
			// onFilterChange: getApiCodeAction,
			filterObj: {},
			sortObj: {},
			pagination: {
				// onSizeChange: getApiCodeAction,
				// onCurrentChange: getApiCodeAction,
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
		}

		const state = reactive({
			tableOption,
		})

		function onCellClick(...params: [ApiCode, unknown, unknown, MouseEvent]) {
			const [row, column, , e] = params
			const target = e.target as HTMLElement

			if (target.dataset.type || target.parentElement?.dataset.type) {
				router.push({ path: `/apiCode/${ row.apiCode }` })
			}
		}

		onActivated(() => {
			getApiCodeAction()
		})

		function getApiCodeAction() {
			tableRef.value?.getTableData?.()
		}

		return {
			...toRefs(state),
			tableRef,
			getApiCodeAction,
		}
	},

	render() {
		const { tableOption, getApiCodeAction } = this

		return (
			<div>
				<ElButton style="margin-bottom: 10px;" size="mini" onClick={ getApiCodeAction }>
					<Refresh /> 刷新
				</ElButton>

				<BaseTable ref={ ref => this.tableRef = ref } option={ tableOption } />
			</div>
		)
	},
})
