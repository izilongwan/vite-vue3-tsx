import UserSearch from '@/components/user-search'
import { defineComponent } from 'vue'

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
