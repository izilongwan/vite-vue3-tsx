import { LoadingMethod } from '@/hook'

const { VITE_API_URL_QUERY, VITE_API_URL_EXEC } = import.meta.env

type HttpParam = RequestInit & {
  url?: string
  data?: Record<string, unknown>
  timeout?: number
}

export interface HttpResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  timestamp: number;
  timecost: number;
  total: number;
  path: string;
  query: string;
}

export function http<T>(param: HttpParam, setLoading?: LoadingMethod) {
  const {
    method = 'POST',
    url = VITE_API_URL_QUERY,
    data: body = {},
    timeout = 1000 * 10 } = param
  const abortController = new AbortController()

  setLoading?.(true)

  const requestFn = () => fetch(url, {
    method,
    signal: abortController.signal,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(json => json.json() as Promise<HttpResponse<T>>)
    .finally(() => setLoading?.(false))

  const timeoutFn = () => new Promise<HttpResponse<T>>((resolve, reject) => {
    setTimeout(() => {
      abortController.abort()
      reject({
        code: 500,
        message: '请求超时',
      } as HttpResponse<T>)
    }, timeout);
  })
    .finally(() => setLoading?.(false))

  return Promise.race([requestFn(), timeoutFn()])
}

export function queryHttp<T>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  return http<T>({ data }, setLoading).then(rs => (rs.code === 0 ? rs.data : rs.data) as T)
}

export function queryHttpOrigin<T>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  return http<T>({ data }, setLoading)
}

export interface ApiCodeData<T> {
  data: T
  json: Record<string, unknown>
}

export function execHttp<T = HttpResponse<number>>(data: HttpParam['data'], setLoading?: LoadingMethod) {
  const param = { url: VITE_API_URL_EXEC, data, method: 'PUT' };
  return http<T>(param, setLoading)
}
