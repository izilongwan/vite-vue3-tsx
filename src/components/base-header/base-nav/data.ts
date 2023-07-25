import { RouteRecord } from 'vue-router'

export function getRoutes(routes: RouteRecord[]) {
  return routes.filter(o => o.meta?.menu && o.path !== '/')
}
