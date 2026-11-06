import { httpUrl } from './http.js'

export function iconUrl(icon: string): string {
  const match = /^(di|mdi):([a-zA-Z0-9_-]+)(?:\.(svg|png|webp))?$/.exec(icon)
  if (!match) return httpUrl(icon) ? icon : ''
  const [, prefix, name, extension = 'svg'] = match
  return prefix === 'mdi' ? `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${name}.svg` : `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/${extension}/${name}.${extension}`
}
