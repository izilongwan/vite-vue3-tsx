import { defineComponent } from 'vue'
import List from './components/list'

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
