import type { Status } from '../types/apps.js'

const goodPath = 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z'
const badPath = 'M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'

export default function StatusIcon({ status }: { status: Status }) {
  const healthy = ['Up', 'Healthy', 'Running'].includes(status)
  let color = 'var(--color-negative)'
  if (healthy) color = 'var(--color-positive)'
  if (status === 'Unknown') color = 'var(--color-subdue)'
  return <div class="monitor-site-status-icon" role="img" aria-label={status} title={status}>
    <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d={healthy ? goodPath : badPath} clip-rule="evenodd"/>
    </svg>
  </div>
}
