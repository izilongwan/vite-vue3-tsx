type HttpParam = RequestInit & {
  url: string
  data?: BodyInit | null | undefined
}

export function http(param: HttpParam) {
  const { method = 'GET', url, data: body } = param
  return fetch(url, {
    method,
    body
  })
    .then(json => json.json())
    .then(rs => rs)
}
