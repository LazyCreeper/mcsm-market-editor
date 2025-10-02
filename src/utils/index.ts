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
      return message.success(t('TXT_CODE_b858d78a'))
    } else {
      await copy(sth)
      if (copied.value) return message.success(t('TXT_CODE_b858d78a'))
    }
  } catch (err: any) {
    console.error(err)
    Modal.error({
      title: t('TXT_CODE_ec393077'),
      content: sth
    })
  }
}

export function emptyValueValidator(value: string | number) {
  if (String(value).trim() === '') throw new Error(t('TXT_CODE_cb08d342'))
  return Promise.resolve()
}

export async function sleep(t: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, t))
}

export const isInt = (x: any) => {
  if (x === null || x === '') {
    return false
  }
  for (let i = 0; i < x.length; i++) {
    const char = x[i]
    if (char < '0' || char > '9') {
      return false
    }
  }
  return true
}

const isIPv6 = (str: string) => {
  return /\[([0-9a-fA-F:]+)\]/g.test(str)
}

export const dockerPortsParse = (ports: string[]): { port1: string; port2: string } => {
  let joinArr = ports.join(':')
  let tempAddr: RegExpMatchArray | null
  const ipMaps = new Map()

  if (isIPv6(joinArr)) {
    tempAddr = joinArr.match(/\[([0-9a-fA-F:]+)\]/g)
    for (let i = 0; i < tempAddr!.length; i++) {
      joinArr = joinArr.replace(tempAddr![i] as any, 'IPv6_' + i)
      ipMaps.set('IPv6_' + i, tempAddr![i])
    }
  }

  let p = isIPv6(ports.join(':')) ? joinArr.split(':') : ports

  let p1: string[] = [],
    p2: string[] = []

  for (let i = 0; i < p.length; i++) {
    if (
      (isInt(p[0]) && p.length === 3 && i < 1) ||
      (!isInt(p[0]) && p.length === 3 && i < 2) ||
      (p.length === 4 && i < 2)
    ) {
      p1.push(p[i]!)
    } else if (p.length === 2) {
      return { port1: p[0]!, port2: p[1]! }
    } else {
      p2.push(p[i]!)
    }
  }

  const v4 = { port1: p1.join(':'), port2: p2.join(':') }

  const v6 = {
    port1:
      p1.length === 1 ? (p1[0] ?? '') : (p1.join(':').replace(p1[0]!, ipMaps.get(p1[0])) ?? ''),
    port2: p2.length === 1 ? (p2[0] ?? '') : (p2.join(':').replace(p2[0]!, ipMaps.get(p2[0])) ?? '')
  }

  return isIPv6(ports.join(':')) ? v6 : v4
}

export const dockerPortsArray = (ports: string[]) => {
  const portArray = ports.map((iterator) => {
    const pad = iterator.split('/')
    const ports = pad[0]
    const protocol = pad[1] ?? ''
    const { port1, port2 } = dockerPortsParse(ports!.split(':'))
    return {
      host: port1,
      container: port2,
      protocol
    }
  })
  return portArray
}
