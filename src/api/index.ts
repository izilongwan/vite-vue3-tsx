import { http } from '@/util/http'

export function getTestManu() {
  return http({
    url: '/api/test/manu2'
  })
}
