import { useState, useEffect, useCallback, useRef } from 'react'
import type { ModuleState, CachedEntry } from '../types'
import type { ModuleConfig } from '../types'
import { readCache, writeCache } from '../utils'
import { fetchModuleStream } from '../api'

export function useModuleData(mod: ModuleConfig, apiKey: string): ModuleState {
  const [data, setData] = useState<CachedEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamBuffer, setStreamBuffer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const load = useCallback(
    async (forceRefresh = false) => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      if (!forceRefresh) {
        const cached = readCache(mod.id)
        if (cached) {
          setData(cached)
          setLastUpdated(cached.fetchedAt)
          setError(null)
          return
        }
      }

      setLoading(true)
      setStreaming(false)
      setStreamBuffer('')
      setError(null)

      await fetchModuleStream(
        mod.prompt,
        apiKey,
        {
          onChunk(chunk) {
            setLoading(false)
            setStreaming(true)
            setStreamBuffer(prev => prev + chunk)
          },
          onComplete(entry) {
            writeCache(mod.id, entry)
            setData(entry)
            setLastUpdated(entry.fetchedAt)
            setStreaming(false)
            setStreamBuffer('')
            setLoading(false)
          },
          onError(err) {
            setError(err)
            setLoading(false)
            setStreaming(false)
          },
        },
        abortRef.current.signal,
      )
    },
    [mod, apiKey],
  )

  // Initial load on mount or when apiKey changes
  useEffect(() => {
    if (!apiKey) return
    load(false)
    return () => { abortRef.current?.abort() }
  }, [load, apiKey])

  const refresh = useCallback(() => { load(true) }, [load])

  return { data, loading, streaming, streamBuffer, error, refresh, lastUpdated }
}
