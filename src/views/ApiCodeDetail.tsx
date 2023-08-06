import { defineComponent, onActivated, reactive } from 'vue'
import ApiCodeDetailContent from '@/components/api-code-detail/content'
import { useRoute } from 'vue-router'
import { ApiCodeDetail, getApiCodeDetail, updateApiCodeDetail } from '@/api'
import { ElMessage } from 'element-plus'
import { useLoading } from '@/hook'

export default defineComponent({
	name: 'ApiCodeDetail',

	setup(prop, { emit, slots }) {
		const route = useRoute()
		const state = reactive({
			contentData: {} as ApiCodeDetail,
		})
		const [wrapRef, setLoading] = useLoading()

		onActivated(() => getApiCodeDetailAction())

		function getApiCodeDetailAction() {
			getApiCodeDetail({ apiCode: route.params.code as string }, setLoading)
				.then(data => {
					Object.assign(state, { contentData: data[0] ?? {} })
				})
		}

		function updateApiCodeDetailAction() {
			updateApiCodeDetail(state.contentData, setLoading).then(data => ElMessage({
				type: data.data === 1 ? 'success' : 'error',
				message: data.message,
			}))
		}

		return {
			state,
			wrapRef,
			updateApiCodeDetailAction,
			getApiCodeDetailAction,
		}
	},

	render() {
		const { updateApiCodeDetailAction, getApiCodeDetailAction } = this
		const { contentData } = this.state

		return (
			<div ref={ ref => this.wrapRef = ref }>
				<ApiCodeDetailContent data={ contentData } updateApiCodeDetail={ updateApiCodeDetailAction }
					getApiCodeDetail={ getApiCodeDetailAction }
				/>
			</div>
		)
	},
})
