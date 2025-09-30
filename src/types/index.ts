import type { TERMINAL_CODE } from './instance'

export interface NyaResponse<T> {
  status: string
  message: string
  error: any
  data: T
}

export enum AppTheme {
  AUTO = 0,
  LIGHT,
  DARK
}

export interface IJsonData {
  [key: string]: any
}

export interface QuickStartPackages {
  language: string
  description: string
  title: string
  category: string
  runtime: string
  size: string
  hardware: string
  remark: string
  targetLink?: string
  author: string
  setupInfo?: {
    startCommand: string
    stopCommand: string
    ie: string
    oe: string
    type: string
    tag: string[]
    fileCode: string
    processType: string
    updateCommand: string
    docker?: {
      image: string
      ports: string[]
      extraVolumes: string[]
      workingDir: string
      env: string[]
      changeWorkdir: boolean
    }
  }
  gameType: string
  image: string
  platform: string
  tags?: string[]
  isSummary?: boolean
}

export interface QuickStartTemplate {
  languages: {
    label: string
    value: string
  }[]
  packages: QuickStartPackages[]
}

export interface MountComponent {
  destroyComponent(delay?: number): void
  emitResult(data?: any): void
}
