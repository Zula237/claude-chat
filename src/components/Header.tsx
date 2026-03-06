import { ScanLine } from './ui/ScanLine'
import { getDayNumber } from '../utils'
import type { ModuleId } from '../types'
import { MODULES } from '../modules'

interface HeaderProps {
  moduleStatuses: Record<ModuleId, 'LOADING' | 'STREAMING' | 'READY' | 'ERROR' | 'INIT'>
  lastRefresh: Date | null
  onRefreshAll: () => void
  anyLoading: boolean
  nextRefreshSec: number
}

export function Header({
  moduleStatuses,
  lastRefresh,
  onRefreshAll,
  anyLoading,
  nextRefreshSec,
}: HeaderProps) {
  const day = getDayNumber()

  return (
    <div
      style={{
        background: '#000d04',
        borderBottom: '1px solid #0a3a18',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <ScanLine />
      <div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#00ff88',
            letterSpacing: 4,
            fontFamily: 'monospace',
          }}
        >
          IRON ATLAS // LIVE OSINT
        </div>
        <div style={{ fontSize: 7, color: '#0a5228', letterSpacing: 3, marginTop: 2 }}>
          IRAN-US-ISRAEL WAR // DAY {day} // AI SITUATIONAL AWARENESS
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 7, color: '#0a4220' }}>
            {lastRefresh
              ? `UPDATED ${lastRefresh.toUTCString()}`
              : 'INITIALIZING...'}
          </span>
          <button
            className="action-btn"
            onClick={onRefreshAll}
            disabled={anyLoading}
          >
            {anyLoading ? 'FETCHING...' : 'REFRESH ALL'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {MODULES.map(m => (
            <span
              key={m.id}
              style={{ fontSize: 7, color: '#0a3018', display: 'flex', alignItems: 'center' }}
            >
              <span className={`status-dot ${moduleStatuses[m.id] ?? 'INIT'}`} />
              {m.id}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 6, color: '#0a3018' }}>
          REFRESH IN {nextRefreshSec}s
        </div>
      </div>
    </div>
  )
}
