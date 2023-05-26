const { VITE_API_URL_QUERY, VITE_API_URL_EXEC } = import.meta.env

type HttpParam = RequestInit & {
  url: string
  data?: Record<string, unknown>
}

interface HttpResponse {
  code: number
  data: any
}

export function http<T = unknown>(param: HttpParam) {
  const { method = param.data ? 'POST' : 'GET', url, data: body = {} } = param
  return fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(json => json.json() as Promise<HttpResponse>)
    .then(rs => (rs.code === 0 ? rs.data : rs.data) as T)
}

export function queryHttp<T>(data: HttpParam['data']) {
  return http<T>({ url: VITE_API_URL_QUERY, data })
}

export function execHttp<T = number>(data: HttpParam['data']) {
  return http<T>({ url: VITE_API_URL_EXEC, data, method: 'PUT', })
}
