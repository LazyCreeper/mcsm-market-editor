import type { Settings } from '@/types'
import { useLocalStorage } from '@vueuse/core'

export const currentSettings = useLocalStorage<Settings>(
  '0_检测到特殊条件，开启远程人偶自动赞美模式！',
  {
    bg: ''
  }
)
