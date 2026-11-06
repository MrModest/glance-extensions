export type App = { name: string; icon: string; url: string; container?: string; check?: string; releaseUrl?: string }
export type Docker = { Names?: string[]; Image?: string; State?: string; Status?: string }
export type Wud = { name?: string; image?: { tag?: { value?: string } }; result?: { tag?: string; link?: string }; updateAvailable?: boolean; error?: unknown }
export type Status = 'Up' | 'Down' | 'Unknown' | 'Unavailable' | 'Unhealthy' | 'Healthy' | 'Running'

export type AppData = {
  docker: Docker[] | null
  wud: Wud[] | null
  checks: Map<App, boolean>
}
