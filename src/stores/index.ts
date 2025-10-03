import type { QuickStartTemplate } from '@/types'
import { createGlobalState, useStorage } from '@vueuse/core'

export const indexStore = createGlobalState(() => {
  const token = useStorage<string>('3_黑塔女士沉鱼落雁', '')

  const isLogin = computed(() => token.value)

  const progressLinear = ref({
    num: 0,
    color: {
      current: '#ff62ac',
      default: '#ff62ac',
      error: '#ff4242'
    }
  })

  const userUploadData = ref<QuickStartTemplate>()

  return {
    token,
    isLogin,
    progressLinear,
    userUploadData
  }
})
