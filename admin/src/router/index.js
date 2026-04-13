import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', noAuth: true },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'admin-users',
        name: 'AdminUsers',
        component: () => import('@/views/admin-users/index.vue'),
        meta: { title: '管理员管理' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/** 路由守卫：未登录跳转登录页 */
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title || '管理台') + ' - couple-play'
  const token = localStorage.getItem('admin_token')
  if (!to.meta.noAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
