import store, { SET_KEY_VALUE } from '@/store'
import {
  createRouter,
  RouteRecordRaw,
  NavigationGuardNext,
  createWebHashHistory,
  RouteLocationNormalized
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/about',
    name: '/',
    meta: {
      type: '/',
      menu: true,
    },
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/about',
        name: 'about',
        meta: {
          type: 'about',
          menu: true,
        },
        component: () => import('@/views/About')
      },
      {
        path: '/blog',
        name: 'blog',
        meta: {
          type: 'blog',
          menu: true,
        },
        component: () => import('@/views/Blog')
      },
      {
        path: '/blog-detail/:code',
        name: 'blogDetail',
        meta: {
          type: 'blogDetail',
          menu: false,
        },
        component: () => import('@/views/BlogDetail')
      },
      {
        path: '/blog-edit/:code?',
        name: 'blogEdit',
        meta: {
          type: 'blogEdit',
          menu: false,
        },
        component: () => import('@/views/BlogEdit')
      },
      {
        path: '/apiCode',
        name: 'apiCode',
        meta: {
          type: 'apiCode',
          menu: true,
        },
        component: () => import('@/views/ApiCode')
      },
      {
        path: '/apiCode-detail/:code',
        name: 'apiCodeDetail',
        meta: {
          type: 'apiCodeDetail',
          menu: false,
        },
        component: () => import('@/views/ApiCodeDetail')
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      type: 'login'
    },
    component: () => import('@/views/Login')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    store.dispatch(SET_KEY_VALUE, { key: 'routes', value: router.getRoutes() })

    const user = localStorage.getItem('user')
    if (to.meta.type === 'login' && user) {
      next({ name: '/' })
      return
    }

    if (to.meta.type === 'home' && !user) {
      next({ name: 'login' })
      return
    }

    next()
  }
)

const addRoutes: RouteRecordRaw[] = [
  {
    path: '/user-search',
    name: 'user-search',
    meta: {
      menu: true,
    },
    component: () => import('@/views/UserSearch')
  },
]

export function addRoute() {
  addRoutes.forEach(r => !router.hasRoute(r.name!) && router.addRoute('/', r))
  store.dispatch(SET_KEY_VALUE, { key: 'routes', value: router.getRoutes() })
}

export function removeRoute() {
  addRoutes.forEach(r => router.hasRoute(r.name!) && router.removeRoute(r.name!))
  store.dispatch(SET_KEY_VALUE, { key: 'routes', value: router.getRoutes() })
}

export default router
