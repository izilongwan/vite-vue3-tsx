import List from '@/components/api-code/list'
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ApiCode',

	setup(prop, { emit, slots }) {
		return {}
	},

	render() {
		return (
			<div>
				<List />
			</div>
		)
	},
})
