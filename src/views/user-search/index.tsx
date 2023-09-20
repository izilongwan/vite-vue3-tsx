import { defineComponent } from 'vue'
import UserSearch from './components/user-search'

export default defineComponent({
  name: 'UserSearchPage',

  render() {
    return (
      <div class="user-search-page">
        <UserSearch />
      </div>
    )
  }
})
