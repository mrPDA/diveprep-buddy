export function collectStringLeaves(
  obj: Record<string, unknown>,
  prefix = '',
): Array<{ path: string; value: string }> {
  const out: Array<{ path: string; value: string }> = []
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'string') {
      out.push({ path, value: val })
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      out.push(...collectStringLeaves(val as Record<string, unknown>, path))
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path))
}

export function setNestedString(
  obj: Record<string, unknown>,
  path: string,
  value: string,
): Record<string, unknown> {
  const clone = structuredClone(obj)
  const keys = path.split('.')
  let cur: Record<string, unknown> = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const next = cur[keys[i]]
    if (!next || typeof next !== 'object') {
      cur[keys[i]] = {}
    }
    cur = cur[keys[i]] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

export function groupLeavesByTopSection(
  leaves: Array<{ path: string; value: string }>,
): Record<string, Array<{ path: string; value: string }>> {
  return leaves.reduce<Record<string, Array<{ path: string; value: string }>>>(
    (acc, leaf) => {
      const section = leaf.path.split('.')[0] ?? 'other'
      acc[section] ??= []
      acc[section].push(leaf)
      return acc
    },
    {},
  )
}

export function humanizePath(path: string): string {
  const last = path.split('.').pop() ?? path
  return last.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ')
}
