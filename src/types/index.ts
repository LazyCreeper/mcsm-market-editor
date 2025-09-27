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
