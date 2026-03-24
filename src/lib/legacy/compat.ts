export type LegacyApiResult<T = unknown> = {
  ok: boolean
  message?: string
  data?: T
}

export function notReady<T = unknown>(message: string): LegacyApiResult<T> {
  return {
    ok: false,
    message,
  }
}

export function ready<T>(data: T, message?: string): LegacyApiResult<T> {
  return {
    ok: true,
    message,
    data,
  }
}