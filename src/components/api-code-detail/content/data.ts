interface RadioMap {
  label: number | string, text: string
}

export interface Json {
  radioMap: Record<string, RadioMap[]>,
  textMap: Record<string, unknown>
}
