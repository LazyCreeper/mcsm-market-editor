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
  setupInfo?: IJsonData
  gameType: string
  image: string
  platform: string
  tags?: string[]
  isSummary?: boolean
}

export interface QuickStartTemplate {
  name: string
  languages: {
    label: string
    value: string
  }[]
  packages: QuickStartPackages[]
}
