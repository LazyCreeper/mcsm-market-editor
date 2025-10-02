import { useLocalStorage, usePreferredDark } from '@vueuse/core'
import { AppTheme } from '@/types'
import { THEME_KEY } from '@/types/const'
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context'
import { Card, theme as antTheme } from 'ant-design-vue'
import { currentSettings } from './settings'

const isPreferredDark = usePreferredDark()

export const theme: ThemeConfig = reactive({
  token: {
    colorPrimary: 'rgb(22, 119, 255)',
    borderRadius: 4,
    fontSizeLG: 14,
    fontSizeSM: 12,
    fontSizeXL: 18
  },
  components: {}
})

export const currentTheme = useLocalStorage<AppTheme>(THEME_KEY, AppTheme.LIGHT)

export const lOrD = computed(() =>
  currentTheme.value === AppTheme.LIGHT
    ? 'light'
    : currentTheme.value === AppTheme.DARK
      ? 'dark'
      : currentTheme.value === AppTheme.AUTO
        ? isPreferredDark.value
          ? 'dark'
          : 'light'
        : 'light'
)

export const isDark = computed(() => lOrD.value === 'dark')

export const setTheme = (theme: AppTheme) => {
  currentTheme.value = theme
  initAppTheme()
}

const setLight = () => {
  theme.algorithm = antTheme.defaultAlgorithm
  document.body.classList.add('app-light-theme')
  document.body.classList.remove('app-dark-theme')
}

const setDark = () => {
  theme.algorithm = antTheme.darkAlgorithm
  document.body.classList.add('app-dark-theme')
  document.body.classList.remove('app-light-theme')
}

export const initAppTheme = () => {
  Card.props.bordered.default = false

  const s = {
    [AppTheme.AUTO]: () => (isPreferredDark.value ? setDark() : setLight()),
    [AppTheme.LIGHT]: () => setLight(),
    [AppTheme.DARK]: () => setDark()
  }
  s[currentTheme.value]()

  setBackground(currentSettings.value.bg)
}

export const setBackgroundImage = (url: string) => {
  const body = document.querySelector('body')
  if (body) {
    body.style.backgroundSize = 'cover'
    body.style.backgroundPosition = 'center'
    body.style.backgroundRepeat = 'no-repeat'
    isDark.value
      ? (body.style.backgroundImage = `linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.65) 100%), url(${url})`)
      : (body.style.backgroundImage = `linear-gradient(135deg, rgba(220,220,220,0.3), rgba(53,53,53,0.3) 100%), url(${url})`)
  }
}

export const setBackground = (url: string) => {
  const body = document.querySelector('body')
  if (body) {
    if (!url) return removeBackground()
    setBackgroundImage(url)

    if (isDark.value) {
      body.classList.add('app-dark-extend-theme')
      body.classList.remove('app-light-extend-theme')
    } else {
      body.classList.add('app-light-extend-theme')
      body.classList.remove('app-dark-extend-theme')
    }
  }
}

export const removeBackground = () => {
  const body = document.querySelector('body')
  if (!body) return
  body.classList.remove('app-light-extend-theme')
  body.classList.remove('app-dark-extend-theme')
  body.style.backgroundImage = 'unset'
}
