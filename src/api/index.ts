import { http } from '@/util/http'

const { VITE_API_URL } = import.meta.env

export function getTestManu() {
  return http({
    url: `${ VITE_API_URL }/test/manu`
  })
}
