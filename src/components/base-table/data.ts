import { LoadingMethod } from '@/hook'
import { queryHttpOrigin } from '@/util/http'

export type FilterParam = Record<string, string | (string | number)[]>

type Callback = () => void

export function formatFilterOption(param: FilterParam, prevFilterObj: FilterParam) {
  const map = Object.entries(prevFilterObj).reduce((p, c) => {
    const [k, v] = c

    if (!v) {
      return p
    }

    if (param[k] == null) {
      Object.assign(p, { [k.replaceAll(/(Contains|Enum)$/g, '')]: v })
    }
    return p
  }, {})

  return Object.entries(Object.assign(map, param)).reduce((prev, curr) => {
    const [k, v] = curr

    if (Array.isArray(v)) {
      const key = `${ k }Enum`
      v.length && Object.assign(prev, { [key]: v })
    } else {
      const key = `${ k }Contains`
      v && Object.assign(prev, { [key]: v })
    }

    return prev
  }, {})
}

export function onFormatFilterChange(option: Record<string, any>, callback?: Callback) {
  const { onFilterChange } = option

  return (param: FilterParam) => {
    const filterObj = formatFilterOption(param, option.filterObj)
    Object.assign(option, { filterObj })
    onFilterChange?.(filterObj)
    callback?.()
  }
}

const ORDER = {
  ascending: 'ASC',
  descending: 'DESC',
}

export function onFormatSortChange(option: Record<string, any>, callback?: Callback) {
  const { onSortChange } = option
  return (param: Record<string, string>) => {
    const sortObj = { orderBy: param.prop?.replaceAll(/([A-Z])/g, (node, key) => `_${ key.toLocaleLowerCase() }`), orderType: ORDER[param.order as keyof typeof ORDER] }
    Object.assign(option, { sortObj })
    onSortChange?.(sortObj)
    callback?.()
  }
}

export function formatPaginationMethod(pagination: Record<string, any>, callback?: Callback) {
  const { onSizeChange, onCurrentChange } = pagination

  pagination.onSizeChange = (pageSize: number) => {
    Object.assign(pagination, { pageSize })

    onSizeChange?.(pageSize)
    callback?.()
  }

  pagination.onCurrentChange = (currentPage: number) => {
    Object.assign(pagination, { currentPage })
    onCurrentChange?.(currentPage)
    callback?.()
  }

  return pagination
}

export function getApiCodeAction<T = unknown>(tableOption: Record<string, any>, setLoading: LoadingMethod) {
  const { pagination, apiCode, param, filterObj = {}, sortObj = {} } = tableOption
  const { pageSize, currentPage: pageIndex } = pagination as Record<string, unknown>

  if (!apiCode) {
    return
  }

  const params = {
    apiCode,
    pageSize,
    pageIndex,
    param: {
      ...param,
      ...filterObj,
      ...sortObj,
    }
  }

  queryHttpOrigin<T[]>(params, setLoading).then(({ data, total }) => {
    Object.assign(tableOption.pagination, { total })
    Object.assign(tableOption, { data })
  })
}
