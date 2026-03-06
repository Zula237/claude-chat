import type { ParsedField, CachedEntry } from './types'

const WAR_START = new Date('2026-02-28T00:00:00Z')
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_PREFIX = 'osint_v1_'

export function getDayNumber(): number {
  return Math.max(1, Math.floor((Date.now() - WAR_START.getTime()) / 86_400_000) + 1)
}

export function formatRelativeTime(epochMs: number): string {
  const diffSec = Math.floor((Date.now() - epochMs) / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  return `${Math.floor(diffMin / 60)}h ago`
}

export function parseFields(raw: string): ParsedField[] {
  const result: ParsedField[] = []
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const colon = trimmed.indexOf(':')
    if (colon < 1) continue
    const key = trimmed.slice(0, colon).trim().toUpperCase().replace(/\s+/g, '_')
    const value = trimmed.slice(colon + 1).trim().replace(/^\[(.+)\]$/, '$1')
    if (key && value) result.push({ key, value })
  }
  return result
}

export function getField(fields: ParsedField[], key: string): string {
  return fields.find(f => f.key === key)?.value ?? ''
}

export function readCache(moduleId: string): CachedEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + moduleId)
    if (!raw) return null
    const entry: CachedEntry = JSON.parse(raw)
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
    return entry
  } catch {
    return null
  }
}

export function writeCache(moduleId: string, entry: CachedEntry): void {
  try {
    localStorage.setItem(CACHE_PREFIX + moduleId, JSON.stringify(entry))
    pruneCache()
  } catch {
    // quota exceeded — silently skip
  }
}

function pruneCache(): void {
  const maxAge = 30 * 60 * 1000
  const toDelete: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith(CACHE_PREFIX)) continue
    try {
      const entry: CachedEntry = JSON.parse(localStorage.getItem(k) ?? 'null')
      if (!entry || Date.now() - entry.fetchedAt > maxAge) toDelete.push(k)
    } catch {
      toDelete.push(k!)
    }
  }
  toDelete.forEach(k => localStorage.removeItem(k))
}
