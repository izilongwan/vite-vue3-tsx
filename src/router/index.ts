import store, { SET_KEY_VALUE } from '@/store';
import {
  createRouter, createWebHashHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/about',
    name: '/',
    meta: {
      type: '/',
      menu: true,
    },
    component: () => import('@/views/home'),
    children: [
      {
        path: '/about',
        name: 'about',
        meta: {
          type: 'about',
          menu: true,
        },
        component: () => import('@/views/about')
      },
      {
        path: '/blog',
        name: 'blog',
        meta: {
          type: 'blog',
          menu: true,
        },
        component: () => import('@/views/blog')
      },
      {
        path: '/blog-detail/:code',
        name: 'blogDetail',
        meta: {
          type: 'blogDetail',
          menu: false,
        },
        component: () => import('@/views/blog-detail')
      },
      {
        path: '/blog-edit/:code?',
        name: 'blogEdit',
        meta: {
          type: 'blogEdit',
          menu: false,
        },
        component: () => import('@/views/blog-edit')
      },
      {
        path: '/apiCode',
        name: 'apiCode',
        meta: {
          type: 'apiCode',
          menu: true,
        },
        component: () => import('@/views/api-code')
      },
      {
        path: '/apiCode/:code',
        name: 'apiCodeDetail',
        meta: {
          type: 'apiCodeDetail',
          menu: false,
        },
        component: () => import('@/views/api-code-detail')
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      type: 'login'
    },
    component: () => import('@/views/login')
  },
  {
    path: '/web-report',
    name: 'web-report',
    meta: {
      type: 'web-report'
    },
    component: () => import('@/views/web-report')
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
    component: () => import('@/views/user-search')
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
