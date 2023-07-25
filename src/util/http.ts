const { VITE_API_URL_QUERY, VITE_API_URL_EXEC } = import.meta.env

type HttpParam = RequestInit & {
  url: string
  data?: Record<string, unknown>
  timeout?: number
}

export interface HttpResponse<T = unknown> {
  code: number;
  data: T[];
  message: string;
  timestamp: number;
  timecost: number;
  total: number;
  path: string;
  query: string;
}

export function http<T>(param: HttpParam) {
  return httpOrigin(param).then(rs => (rs.code === 0 ? rs.data : rs.data) as T)
}

export function httpOrigin<T>(param: HttpParam) {
  const {
    method = param.data ? 'POST' : 'GET', url, data: body = {},
    timeout = 1000 * 10 } = param
  const abortController = new AbortController()

  const requestFn = () => fetch(url, {
    method,
    signal: abortController.signal,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(json => json.json() as Promise<HttpResponse<T>>)

  const timeoutFn = () => new Promise<HttpResponse<T>>((resolve, reject) => {
    setTimeout(() => {
      abortController.abort()
      reject({
        code: 500,
        message: '请求超时',
      } as HttpResponse<T>)
    }, timeout);
  })

  return Promise.race([requestFn(), timeoutFn()])
}

export function queryHttp<T>(data: HttpParam['data'], origin = false) {
  const param = { url: VITE_API_URL_QUERY, data }
  return origin ? httpOrigin<T>(param) : http<T>(param)
}

export function execHttp<T = number>(data: HttpParam['data'], origin = false) {
  const param = { url: VITE_API_URL_EXEC, data, method: 'PUT', };
  return origin ? httpOrigin<T>(param) : http<T>(param)
}
