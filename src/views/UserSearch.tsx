import BaseNav from '@/components/base-nav'
import UserSearch from '@/components/user-search'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserSearchPage',

  render() {
    return (
      <div class="user-search-page">
        <BaseNav />

        <UserSearch />
      </div>
    )
  }
})
