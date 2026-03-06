import { Card } from '../ui/Card'
import { Tag } from '../ui/Tag'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

const THREAT_COLORS: Record<string, string> = {
  IMMINENT: '#ff0000',
  HIGH: '#ff3333',
  ELEVATED: '#ff8800',
  GUARDED: '#ffcc00',
  LOW: '#00ff88',
}

const DEFCON_COLORS: Record<string, string> = {
  '1': '#ff0000',
  '2': '#ff4400',
  '3': '#ff8800',
  '4': '#ffcc00',
  '5': '#00ff88',
}

export function NuclearPanel({ fields }: Props) {
  const defconEquiv = getField(fields, 'DEFCON_EQUIV')
  const nuclearThreat = getField(fields, 'NUCLEAR_THREAT')
  const iranEnrichment = getField(fields, 'IRAN_ENRICHMENT')
  const breakoutTime = getField(fields, 'BREAKOUT_TIME')
  const iranPosture = getField(fields, 'IRAN_POSTURE')
  const samson = getField(fields, 'ISRAEL_SAMSON')
  const iaea = getField(fields, 'IAEA_STATUS')
  const chem = getField(fields, 'CHEM_THREAT')
  const bio = getField(fields, 'BIO_THREAT')
  const redLines = getField(fields, 'RED_LINES')
  const probPct = getField(fields, 'ESCALATION_PROB')
  const assessment = getField(fields, 'ASSESSMENT')

  const tc = THREAT_COLORS[nuclearThreat] ?? '#ff8800'
  const dc = DEFCON_COLORS[defconEquiv] ?? '#ff8800'

  const samsonColors: Record<string, string> = {
    ACTIVE: '#ff0000',
    CONSIDERED: '#ff8800',
    DORMANT: '#00ff88',
  }
  const sc = samsonColors[samson?.toUpperCase()] ?? '#ffcc00'

  const sections: [string, string, string][] = [
    ['IRAN NUCLEAR POSTURE', '#ff4444', iranPosture],
    ['IAEA STATUS', '#44aaff', iaea],
    ['CHEMICAL WEAPONS THREAT', '#ffcc00', chem],
    ['BIOLOGICAL WEAPONS THREAT', '#ff88aa', bio],
    ['NUCLEAR RED LINES', '#ff6600', redLines],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {defconEquiv && (
          <div
            style={{
              background: '#0a0000',
              border: `2px solid ${dc}55`,
              borderRadius: 4,
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 7, color: '#550000', letterSpacing: 2, marginBottom: 4 }}>
              US DEFCON EQUIV
            </div>
            <div
              style={{
                fontSize: 36,
                color: dc,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                lineHeight: 1,
              }}
            >
              {defconEquiv}
            </div>
          </div>
        )}
        {nuclearThreat && (
          <div
            style={{
              background: '#0a0000',
              border: `2px solid ${tc}44`,
              borderRadius: 4,
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 7, color: '#550000', letterSpacing: 2, marginBottom: 4 }}>
              NUCLEAR THREAT
            </div>
            <div
              style={{
                fontSize: 16,
                color: tc,
                fontWeight: 'bold',
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            >
              {nuclearThreat}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {iranEnrichment && (
          <Card label="IRAN ENRICHMENT" value={iranEnrichment} color="#ff4444" />
        )}
        {breakoutTime && (
          <Card label="BREAKOUT TIME" value={breakoutTime} color="#ff8800" />
        )}
      </div>

      {samson && (
        <div
          style={{
            background: '#0a0000',
            border: `1px solid ${sc}44`,
            borderLeft: `4px solid ${sc}`,
            borderRadius: 3,
            padding: '10px 13px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 7, color: '#660000', letterSpacing: 2 }}>
              ISRAEL SAMSON OPTION
            </div>
            <Tag color={sc}>{samson}</Tag>
          </div>
        </div>
      )}

      {probPct && (
        <div
          style={{
            background: '#0f0000',
            border: '1px solid #ff000022',
            borderRadius: 3,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 7, color: '#660000', letterSpacing: 2, marginBottom: 6 }}>
            NUCLEAR USE PROBABILITY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                flex: 1,
                height: 8,
                background: '#1a0000',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, parseFloat(probPct) || 0)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg,#ff4400,#ff0000)',
                  transition: 'width 1s ease',
                }}
              />
            </div>
            <span
              style={{ fontSize: 16, color: '#ff3333', fontFamily: 'monospace', fontWeight: 700 }}
            >
              {probPct}%
            </span>
          </div>
        </div>
      )}

      {sections.map(([label, color, value]) =>
        value ? (
          <div
            key={label}
            style={{
              background: '#060000',
              border: `1px solid ${color}20`,
              borderLeft: `3px solid ${color}55`,
              borderRadius: 3,
              padding: '9px 12px',
            }}
          >
            <div
              style={{ fontSize: 7, color: `${color}88`, letterSpacing: 1.5, marginBottom: 4 }}
            >
              {label}
            </div>
            <div style={{ fontSize: 10, color: `${color}cc`, lineHeight: 1.6 }}>{value}</div>
          </div>
        ) : null,
      )}

      {assessment && (
        <div
          style={{
            background: '#0a0000',
            border: '1px solid #ff220022',
            borderRadius: 3,
            padding: '10px 13px',
          }}
        >
          <div style={{ fontSize: 7, color: '#882222', letterSpacing: 2, marginBottom: 5 }}>
            OVERALL ASSESSMENT
          </div>
          <div style={{ fontSize: 10, color: '#ffaaaa', lineHeight: 1.65 }}>{assessment}</div>
        </div>
      )}

      {nuclearThreat && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'IMMINENT'] as const).map(level => (
            <Tag
              key={level}
              color={THREAT_COLORS[level]}
              style={{ opacity: level === nuclearThreat ? 1 : 0.25 }}
            >
              {level}
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
