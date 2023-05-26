export function getProxyUrlMap(env: Record<string, string>) {
  return Object.entries(env).reduce((p, c) => {
    const [key, value] = c
    if (key.startsWith('VITE_API_URL')) {
      const k = key.replace('VITE', 'VITE_PROXY')
      Object.assign(p, {
        [value]: {
          target: env[k],
          changeOrigin: true,
          rewrite: (path: string) => path.replace(new RegExp(`^${ value }`), ''),
        },
      })
    }

    return p
  }, {})
}
