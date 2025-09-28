import { createRouter, createWebHistory } from 'vue-router'
import { indexStore } from '@/stores'
import { t } from '@/utils/i18n'
import { notification } from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: t('模板编辑器'),
      component: () => import('@/views/home/HomeView.vue'),
      meta: {}
    },

    // auth
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/auth/index.vue'),

      children: [
        {
          path: '',
          name: 'authRedirect',
          redirect: '/auth/login'
        },
        {
          path: 'login',
          name: t('登录'),
          component: () => import('@/views/auth/Login.vue'),
          meta: {
            image: '',
            subtitle: ''
          }
        },
        {
          path: 'register',
          name: t('注册'),
          component: () => import('@/views/auth/Register.vue'),
          meta: {
            image: '',
            subtitle: ''
          }
        },
        {
          path: 'reset',
          name: t('重置密码'),
          component: () => import('@/views/auth/Reset.vue'),
          meta: {
            image: '',
            subtitle: ''
          }
        }
      ]
    },

    // App
    {
      path: '/app',
      name: 'appView',
      component: () => import('@/views/app/index.vue'),
      meta: {
        // needLogin: true
      },

      children: [
        {
          path: '',
          name: 'appRedirect',
          redirect: '/app/dashboard'
        },

        {
          path: 'dashboard',
          name: t('仪表板'),
          component: () => import('@/views/app/dashboard/index.vue'),
          meta: {
            mainMenu: true
          }
        },

        {
          path: 'editor',
          name: t('编辑器'),
          component: () => import('@/views/app/editor/index.vue'),
          meta: {
            mainMenu: true
          }
        }
      ]
    },

    // 403
    {
      path: '/403',
      name: '403 Forbidden',
      meta: {},
      component: () => import('@/views/error/403.vue')
    },

    // 404
    {
      path: '/404',
      name: '404 Not Found',
      meta: {},
      component: () => import('@/views/error/404.vue')
    }
  ]
})

const { isLogin, progressLinear } = indexStore()
let timer: ReturnType<typeof setTimeout>

router.beforeEach((to, from, next) => {
  if (timer) clearInterval(timer)
  progressLinear.value.color.current = progressLinear.value.color.default
  progressLinear.value.num += Math.floor(Math.random() * 6) + 1
  timer = setInterval(() => {
    progressLinear.value.num += 1
    if (progressLinear.value.num >= 95) {
      clearInterval(timer)
    }
  }, 555)

  if (isLogin.value && to.path.startsWith('/auth')) return next('/app/dashboard')

  if (to.meta.needLogin && !isLogin.value) {
    notification.error({
      message: t('错误'),
      description: t('未授权的访问，请先登录')
    })
    return next('/auth/login')
  }

  if (!to.name) {
    return next({
      path: '/404',
      replace: true,
      query: {
        errPath: to.fullPath
      }
    })
  }

  document.title = (to.meta.title || t('模板编辑器')) + ' - MCSManager'

  next()
})

router.afterEach(() => {
  progressLinear.value.num = 100
  setTimeout(() => {
    progressLinear.value.num = 0
    clearInterval(timer)
  }, 500)
})

router.onError((error) => {
  progressLinear.value.color.current = progressLinear.value.color.error
  progressLinear.value.num = 100
  setTimeout(() => {
    progressLinear.value.num = 0
    clearInterval(timer)
  }, 500)
  notification.error({
    message: '路由错误',
    description: error.message
  })
  console.error('Router Err:', error)
})

export default router
