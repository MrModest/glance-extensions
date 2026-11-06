export const httpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export async function get(url: string): Promise<Response> {
  if (!httpUrl(url)) throw new Error('Invalid URL')
  const response = await fetch(url, { signal: AbortSignal.timeout(5000), redirect: 'error' })
  if (!response.ok) throw new Error('Request failed')
  return response
}
export async function snapshot<T>(base: string | undefined, path: string): Promise<T[] | null> {
  try {
    if (!base || !httpUrl(base)) return null
    const data: unknown = await (await get(`${base.replace(/\/$/, '')}${path}`)).json()
    return Array.isArray(data) ? data as T[] : null
  } catch { return null }
}
