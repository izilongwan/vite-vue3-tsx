/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLES: string[]
  readonly VITE_API_URL: string
  readonly VITE_API_URL_QUERY: string
  readonly VITE_API_URL_EXEC: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
