import { ElLoading } from 'element-plus'
import { ref } from 'vue'

export type LoadingMethod = (loading: boolean) => void

export function useLoading() {
  const wrapRef = ref()
  const loadingRef = ref()

  function setLoading(loading: boolean) {
    if (!loadingRef.value) {
      loading && (loadingRef.value = ElLoading.service({ target: wrapRef.value }))
      return
    }

    loadingRef.value?.close()
    loadingRef.value = null
  }

  return [wrapRef, setLoading as LoadingMethod] as const
}
