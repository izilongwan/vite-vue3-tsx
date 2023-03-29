/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLES: string[]
  readonly VITE_API_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
