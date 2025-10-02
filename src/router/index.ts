import { createRouter, createWebHistory } from 'vue-router'
import { indexStore } from '@/stores'
import { t } from '@/utils/i18n'
import { notification } from 'ant-design-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: t('TXT_CODE_54275b9c'),
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
          name: t('TXT_CODE_d2c1a316'),
          component: () => import('@/views/auth/Login.vue'),
          meta: {
            image: '',
            subtitle: ''
          }
        },
        {
          path: 'register',
          name: t('TXT_CODE_8899f89f'),
          component: () => import('@/views/auth/Register.vue'),
          meta: {
            image: '',
            subtitle: ''
          }
        },
        {
          path: 'reset',
          name: t('TXT_CODE_3217837'),
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
          name: t('TXT_CODE_e4456ae3'),
          component: () => import('@/views/app/dashboard/index.vue'),
          meta: {
            mainMenu: false
          }
        },

        {
          path: 'editor',
          name: t('TXT_CODE_32a4d9fb'),
          component: () => import('@/views/app/editor/index.vue'),
          meta: {
            mainMenu: false
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

router.beforeEach((to, _, next) => {
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
      message: t('TXT_CODE_ac405b50'),
      description: t('TXT_CODE_ff0435d4')
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

  document.title = (to.meta.title || t('TXT_CODE_54275b9c')) + ' - MCSManager'

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
    message: 'Route Error',
    description: error.message
  })
  console.error('Router Err:', error)
})

export default router
