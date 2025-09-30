import { createI18n, type I18n } from 'vue-i18n'
import zhCN from '@/languages/zh-CN.json'

export const LANGUAGE_KEY = '黑塔女士举世无双'

// DO NOT I18N
// If you want to add the language of your own country, you need to add the code here.
const SUPPORTED_LANGS = [
  {
    label: 'English',
    value: 'en-US'
  },
  {
    label: '简体中文',
    value: 'zh-CN'
  }
]

let i18n: I18n

function toStandardLang(lang?: string) {
  if (!lang) return 'zh-CN'
  // return lang.replace('-', '_').toLowerCase()
  return lang
}

const messages: Record<string, any> = {
  'zh-CN': zhCN
}
async function initI18n(l: string) {
  if (i18n) return console.log(i18n)
  const lang = toStandardLang(l)

  document.documentElement.lang = lang
  const langFiles = import.meta.glob('@/languages/*.json')

  for (const path in langFiles) {
    for (const l of SUPPORTED_LANGS) {
      if (toStandardLang(path).includes(l.value) && typeof langFiles[path] === 'function') {
        messages[l.value] = await langFiles[path]()
      }
    }
  }

  i18n = createI18n({
    allowComposition: true,
    globalInjection: true,
    locale: lang,
    fallbackLocale: 'zh-CN',
    messages: messages
  })
}

function getI18nInstance() {
  return i18n
}

const getSupportLanguages = (): string[] => {
  return SUPPORTED_LANGS.map((v) => v.value)
}

const searchSupportLanguage = (lang: string) => {
  const findLang = getSupportLanguages().find((v) =>
    v.toLocaleLowerCase().includes(toStandardLang(lang).toLocaleLowerCase())
  )
  if (findLang) return findLang
  return 'zh-CN'
}

const setLanguage = (lang: string, reload = true) => {
  lang = toStandardLang(lang)
  localStorage.setItem(LANGUAGE_KEY, lang)
  i18n.global.locale = lang
  document.documentElement.lang = lang
  if (reload) window.location.reload()
}

const getCurrentLang = (): string => {
  const curLang = String(i18n?.global.locale).toLowerCase()
  return searchSupportLanguage(curLang)
}

const isCN = () => {
  return getCurrentLang() === 'zh-CN'
}

const isEN = () => {
  return getCurrentLang() === 'en-US'
}

// const t = i18n?.global?.t
const t = (key: string, ...args: any[]): string => {
  try {
    if (!i18n?.global) {
      console.warn(`i18n not initialized! Key: ${key}`)
      return key
    }
    return (i18n.global.t as (key: string, ...args: any[]) => string)(key, ...args)
  } catch (e) {
    console.error(`i18n translation failed for key "${key}":`, e)
    return key
  }
}

// const t = (...args: any[]): string => i18n.global.t
;(window as any).t = t
;(window as any).getCurrentLang = getCurrentLang

export {
  setLanguage,
  getCurrentLang,
  searchSupportLanguage,
  getI18nInstance,
  t,
  initI18n,
  isCN,
  isEN,
  getSupportLanguages,
  SUPPORTED_LANGS
}

