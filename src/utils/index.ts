import { t } from './i18n'
import type { NyaResponse } from '@/types'
import { useClipboard } from '@vueuse/core'
import type { AxiosResponse } from 'axios'
import { Modal, message } from 'ant-design-vue'

export interface ConditionFilterItem {
  condition?: (index?: number) => boolean
}

export function arrayFilter<T>(arr: (T & ConditionFilterItem)[]): T[] {
  return arr.filter((item, index) => {
    if (typeof item.condition === 'function') {
      return item.condition(index)
    } else {
      return true
    }
  })
}

export const getResponse = async <T>(response: AxiosResponse<NyaResponse<T>>) => response.data.data

const { copy, copied, isSupported } = useClipboard()
export const toCopy = async (sth: any) => {
  try {
    if (!isSupported.value) {
      const input = document.createElement('input')
      input.setAttribute('value', sth)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      return message.success(t('复制成功'))
    } else {
      await copy(sth)
      if (copied.value) return message.success(t('复制成功'))
    }
  } catch (err: any) {
    console.error(err)
    Modal.error({
      title: t('复制失败，请手动复制以下内容'),
      content: sth
    })
  }
}
