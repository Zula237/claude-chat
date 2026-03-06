import { useState, useEffect, useCallback, useRef } from 'react'
import type { ModuleId, CachedEntry, ParsedField } from './types'
import { MODULES } from './modules'
import { readCache, writeCache, formatRelativeTime } from './utils'
import { fetchModuleStream } from './api'

import { ApiKeyPrompt } from './components/ApiKeyPrompt'
import { Header } from './components/Header'
import { LiveTicker } from './components/LiveTicker'
import { MetricsBar } from './components/MetricsBar'
import { TabBar } from './components/TabBar'
import { Spinner } from './components/ui/Spinner'
import { ErrBox } from './components/ui/ErrBox'
import { RawDataView } from './components/ui/RawDataView'

import { SitrepPanel }  from './components/panels/SitrepPanel'
import { StrikesPanel } from './components/panels/StrikesPanel'
import { HormuzPanel }  from './components/panels/HormuzPanel'
import { ActorsPanel }  from './components/panels/ActorsPanel'
import { GlobalPanel }  from './components/panels/GlobalPanel'
import { CyberPanel }   from './components/panels/CyberPanel'
import { NuclearPanel } from './components/panels/NuclearPanel'

// ── Types ─────────────────────────────────────────────────────────────────
type FetchStatus = 'INIT' | 'LOADING' | 'STREAMING' | 'READY' | 'ERROR'

interface ModSlot {
  status: FetchStatus
  data: CachedEntry | null
  streamBuffer: string
  error: string | null
  lastUpdated: number | null
}

type AllSlots = Record<ModuleId, ModSlot>

const REFRESH_INTERVAL = 300_000
const API_KEY_STORAGE = 'osint_apikey'

// ── Helpers ───────────────────────────────────────────────────────────────
function resolveApiKey(): string {
  const env = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (env) return env
  return localStorage.getItem(API_KEY_STORAGE) ?? ''
}

function emptySlots(): AllSlots {
  return Object.fromEntries(
    MODULES.map(m => [m.id, { status: 'INIT', data: null, streamBuffer: '', error: null, lastUpdated: null }])
  ) as AllSlots
}

function renderPanel(id: ModuleId, fields: ParsedField[]) {
  switch (id) {
    case 'SITREP':  return <SitrepPanel  fields={fields} />
    case 'STRIKES': return <StrikesPanel fields={fields} />
    case 'HORMUZ':  return <HormuzPanel  fields={fields} />
    case 'ACTORS':  return <ActorsPanel  fields={fields} />
    case 'GLOBAL':  return <GlobalPanel  fields={fields} />
    case 'CYBER':   return <CyberPanel   fields={fields} />
    case 'NUCLEAR': return <NuclearPanel fields={fields} />
  }
}

// ── Root App ──────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(resolveApiKey)
  const [active, setActive] = useState<ModuleId>('SITREP')
  const [showRaw, setShowRaw] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [slots, setSlots] = useState<AllSlots>(emptySlots)
  const [tick, setTick] = useState(0)

  const abortsRef = useRef<Partial<Record<ModuleId, AbortController>>>({})

  // 1-second tick for countdown timer
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  void tick // drives re-render for nextRefreshSec

  // ── Load one module ──────────────────────────────────────────────────────
  const loadModule = useCallback(
    async (id: ModuleId, force = false) => {
      if (!apiKey) return
      const mod = MODULES.find(m => m.id === id)!

      // Cancel existing request for this module
      abortsRef.current[id]?.abort()
      const ctrl = new AbortController()
      abortsRef.current[id] = ctrl

      // Try cache first (unless force refresh)
      if (!force) {
        const cached = readCache(id)
        if (cached) {
          setSlots(prev => ({
            ...prev,
            [id]: { status: 'READY', data: cached, streamBuffer: '', error: null, lastUpdated: cached.fetchedAt },
          }))
          return
        }
      }

      // Start streaming fetch
      setSlots(prev => ({
        ...prev,
        [id]: { ...prev[id], status: 'LOADING', streamBuffer: '', error: null },
      }))

      await fetchModuleStream(
        mod.prompt,
        apiKey,
        {
          onChunk(chunk) {
            setSlots(prev => ({
              ...prev,
              [id]: { ...prev[id], status: 'STREAMING', streamBuffer: prev[id].streamBuffer + chunk },
            }))
          },
          onComplete(entry) {
            writeCache(id, entry)
            setSlots(prev => ({
              ...prev,
              [id]: { status: 'READY', data: entry, streamBuffer: '', error: null, lastUpdated: entry.fetchedAt },
            }))
          },
          onError(err) {
            setSlots(prev => ({
              ...prev,
              [id]: { ...prev[id], status: 'ERROR', error: err, streamBuffer: '' },
            }))
          },
        },
        ctrl.signal,
      )
    },
    [apiKey],
  )

  // ── Load all modules ─────────────────────────────────────────────────────
  const loadAll = useCallback(
    (force = false) => {
      MODULES.forEach(m => loadModule(m.id, force))
    },
    [loadModule],
  )

  // Initial load on mount / api key change
  useEffect(() => {
    if (!apiKey) return
    loadAll(false)
    return () => { Object.values(abortsRef.current).forEach(c => c?.abort()) }
  }, [loadAll, apiKey])

  // Auto refresh every 5 min
  useEffect(() => {
    if (!apiKey) return
    const id = setInterval(() => { loadAll(true); setLastRefresh(new Date()) }, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [loadAll, apiKey])

  // Mark last refresh when all modules settle
  useEffect(() => {
    const allDone = MODULES.every(m => {
      const s = slots[m.id].status
      return s === 'READY' || s === 'ERROR'
    })
    if (allDone) setLastRefresh(new Date())
  }, [slots])

  // ── Derived values ───────────────────────────────────────────────────────
  const anyLoading = MODULES.some(m => slots[m.id].status === 'LOADING' || slots[m.id].status === 'STREAMING')

  const moduleStatuses = Object.fromEntries(
    MODULES.map(m => [m.id, slots[m.id].status])
  ) as Record<ModuleId, FetchStatus>

  const nextRefreshSec = lastRefresh
    ? Math.max(0, Math.ceil((REFRESH_INTERVAL - (Date.now() - lastRefresh.getTime())) / 1000))
    : Math.ceil(REFRESH_INTERVAL / 1000)

  const sitrepFields = slots['SITREP']?.data?.fields ?? null
  const hormuzFields = slots['HORMUZ']?.data?.fields ?? null

  const activeSlot = slots[active]
  const activeMod  = MODULES.find(m => m.id === active)!

  // ── Render ───────────────────────────────────────────────────────────────
  if (!apiKey) {
    return (
      <ApiKeyPrompt
        onSubmit={key => {
          localStorage.setItem(API_KEY_STORAGE, key)
          setApiKey(key)
        }}
      />
    )
  }

  return (
    <div
      style={{
        background: '#010803',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#00cc66',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      <Header
        moduleStatuses={moduleStatuses}
        lastRefresh={lastRefresh}
        onRefreshAll={() => { loadAll(true); setLastRefresh(null) }}
        anyLoading={anyLoading}
        nextRefreshSec={nextRefreshSec}
      />

      <LiveTicker sitrepFields={sitrepFields} nextRefreshSec={nextRefreshSec} />
      <MetricsBar sitrepFields={sitrepFields} hormuzFields={hormuzFields} />
      <TabBar active={active} onChange={id => { setActive(id); setShowRaw(false) }} />

      {/* View toggle row */}
      <div
        style={{
          background: '#010a03',
          borderBottom: '1px solid #0a1a08',
          padding: '4px 16px',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 7, color: '#0a4020', letterSpacing: 1 }}>VIEW:</span>
        {(['FORMATTED', 'RAW DATA'] as const).map(label => {
          const isActive = label === 'FORMATTED' ? !showRaw : showRaw
          return (
            <button
              key={label}
              className="action-btn"
              style={{
                padding: '2px 10px',
                fontSize: 7,
                borderColor: isActive ? '#00ff66' : '#0a5525',
                color: isActive ? '#00ff66' : '#00aa44',
              }}
              onClick={() => setShowRaw(label === 'RAW DATA')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Main panel */}
      <div style={{ padding: '16px 18px', flex: 1, overflowY: 'auto' }}>
        {/* Per-module header: last updated + per-module refresh */}
        {(activeSlot.data || activeSlot.error) && (
          <div
            className="panel-footer"
            style={{
              marginBottom: 12,
              marginTop: 0,
              borderTop: 'none',
              borderBottom: '1px solid #0a1a08',
              paddingBottom: 8,
            }}
          >
            <span style={{ fontSize: 7, color: '#0a4020' }}>
              {activeSlot.lastUpdated
                ? `${activeMod.fullName.toUpperCase()} // UPDATED ${formatRelativeTime(activeSlot.lastUpdated)}`
                : activeMod.fullName.toUpperCase()}
            </span>
            <button
              className="action-btn"
              onClick={() => loadModule(active, true)}
              disabled={activeSlot.status === 'LOADING' || activeSlot.status === 'STREAMING'}
            >
              {activeSlot.status === 'LOADING' || activeSlot.status === 'STREAMING'
                ? '…'
                : 'REFRESH'}
            </button>
          </div>
        )}

        {activeSlot.status === 'LOADING' && (
          <Spinner color={activeMod.color} />
        )}

        {activeSlot.status === 'STREAMING' && !activeSlot.data && (
          <div>
            <Spinner color={activeMod.color} label="RECEIVING INTELLIGENCE STREAM" />
            <pre
              style={{
                color: '#446644',
                fontSize: 8,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '8px 0',
                maxHeight: 160,
                overflow: 'hidden',
              }}
            >
              {activeSlot.streamBuffer}
            </pre>
          </div>
        )}

        {activeSlot.status === 'ERROR' && activeSlot.error && (
          <ErrBox
            label={activeMod.fullName}
            error={activeSlot.error}
            onRetry={() => loadModule(active, true)}
          />
        )}

        {activeSlot.data && activeSlot.status !== 'LOADING' && (
          showRaw ? (
            <RawDataView fields={activeSlot.data.fields} raw={activeSlot.data.raw} />
          ) : (
            renderPanel(active, activeSlot.data.fields)
          )
        )}

        {activeSlot.status === 'INIT' && (
          <div style={{ color: '#0a4020', fontSize: 9, padding: 20, textAlign: 'center' }}>
            Initializing…
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          background: '#000a03',
          borderTop: '1px solid #0a1a08',
          padding: '3px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 6,
          color: '#0a3a15',
          letterSpacing: 1,
          flexShrink: 0,
        }}
      >
        <span>IRON ATLAS // OPEN-SOURCE INTELLIGENCE // AI</span>
        <span>PUBLIC SOURCES ONLY // CROSS-REFERENCE RECOMMENDED</span>
      </div>
    </div>
  )
}
