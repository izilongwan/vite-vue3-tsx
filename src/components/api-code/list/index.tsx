import { getApiCode } from '@/api'
import BaseTable from '@/components/base-table'
import { Refresh } from '@element-plus/icons-vue'
import { ElButton, ElTag } from 'element-plus'
import { defineComponent, onActivated, reactive, toRefs } from 'vue'

export default defineComponent({
	name: 'ApiCodeList',

	setup(prop, { emit, slots }) {
		const tableOption = {
			data: [],
			columns: [
				{
					label: 'Index',
					prop: 'index',
					type: 'index',
					width: 100,
				},
				{
					label: 'apiCode',
					prop: 'apiCode',
					width: 150,
					sortable: true,
					filters: [
						{ text: 'Y', value: 'Y' },
						{ text: 'N', value: 'N' },
					],
				},
				{
					label: 'apiType',
					prop: 'apiType',
					width: 120,
				},
				{
					label: 'description',
					prop: 'description',
					width: 120,
				},
				{
					label: 'state',
					prop: 'stateTxt',
					slots: {
						default: (row: any) => {
							const { state, stateTxt } = row
							return (
								<ElTag type={ state == 1 ? 'success' : 'danger' }>{ stateTxt }</ElTag>
							)
						}
					}
				},
				{
					label: 'updateTime',
					prop: 'updateTime',
					width: 120,
				},
				{
					label: 'operate',
					prop: 'operate',
					width: 160,
					fixed: 'right',
					slots: {
						default: (row: any, prop: string) => {
							const { state } = row
							return (
								<>
									<ElButton type="primary" size="mini">详情</ElButton>
									<ElButton type={ state === 1 ? 'danger' : 'warning' } data-state={ state } size="mini">{ state === 1 ? '停用' : '启用' }</ElButton>
								</>
							)
						}
					}
				},
			],
			stripe: true,
			maxHeight: 580,
			onCellClick,
			onSortChange,
			onFilterChange,
			pagination: {
				onSizeChange,
				onCurrentChange,
				total: 0,
				currentPage: 1,
				pageSize: 10,
			},
		}

		const state = reactive({
			tableOption,
		})

		function onCellClick(...params: unknown[]) {
			console.log(params)
		}

		function onSortChange(params: Record<string, unknown>) {
			console.log(params)
		}

		function onFilterChange(params: Record<string, unknown>) {
			console.log(params)
		}

		function onSizeChange(pageSize: number) {
			Object.assign(state.tableOption.pagination, { pageSize })
			getApiCodeAction()
		}

		function onCurrentChange(currentPage: number) {
			Object.assign(state.tableOption.pagination, { currentPage })
			getApiCodeAction()
		}

		onActivated(() => {
			getApiCodeAction()
		})

		function getApiCodeAction() {
			const { tableOption } = state
			const { pageSize, currentPage: pageIndex } = tableOption.pagination

			Object.assign(tableOption, { loading: true })
			getApiCode({ pageSize, pageIndex }).then(({ data, total }) => {
				Object.assign(tableOption.pagination, { total })
				Object.assign(tableOption, { data })
			})
				.finally(() => Object.assign(tableOption, { loading: false }))
		}

		return {
			...toRefs(state),
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

				<BaseTable option={ tableOption } />
			</div>
		)
	},
})
