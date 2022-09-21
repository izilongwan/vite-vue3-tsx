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
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      type: 'home'
    },
    component: () => import('@/views/Home')
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
    path: '/about',
    name: 'about',
    meta: {
      type: 'about'
    },
    component: () => import('@/views/About')
  },
  {
    path: '/user-search',
    name: 'user-search',
    component: () => import('@/views/UserSearch')
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
    const user = localStorage.getItem('user')
    if (to.meta.type === 'login' && user) {
      next({ name: 'home' })
      return
    }

    if (to.meta.type === 'home' && !user) {
      next({ name: 'login' })
      return
    }

    next()
  }
)

export default router
