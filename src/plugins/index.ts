import '@/assets/styles/base.scss'
import '@/assets/styles/tools.scss'
import '@/assets/styles/variables.scss'
import '@/assets/styles/variables-dark.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/bg-extend-theme.scss'
import '@/assets/styles/style.css'
import { initAppTheme } from './theme'

export const registerPlugins = async () => {
  initAppTheme()
}
