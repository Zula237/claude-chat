import { Card } from '../ui/Card'
import { Tag } from '../ui/Tag'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

const THREAT_COLORS: Record<string, string> = {
  SEVERE: '#ff0000',
  HIGH: '#ff4444',
  ELEVATED: '#ffcc00',
  GUARDED: '#44aaff',
  LOW: '#00ff88',
}

const GRID_COLORS: Record<string, string> = {
  OPERATIONAL: '#00ff66',
  DEGRADED: '#ffcc00',
  OFFLINE: '#ff2020',
  UNDER_ATTACK: '#ff4444',
}

export function CyberPanel({ fields }: Props) {
  const threatLevel = getField(fields, 'THREAT_LEVEL')
  const iranOps = getField(fields, 'IRAN_OPS')
  const israelOps = getField(fields, 'ISRAEL_OPS')
  const usCyberCmd = getField(fields, 'US_CYBER_CMD')
  const gridIran = getField(fields, 'GRID_IRAN')
  const gridIsrael = getField(fields, 'GRID_ISRAEL')
  const infraHits = getField(fields, 'INFRASTRUCTURE_HITS')
  const aptGroups = getField(fields, 'APT_GROUPS')
  const comms = getField(fields, 'COMMS_DISRUPTION')
  const hacktivist = getField(fields, 'HACKTIVIST')
  const psyops = getField(fields, 'PSYOPS')
  const escalationRisk = getField(fields, 'ESCALATION_RISK')

  const tc = THREAT_COLORS[threatLevel] ?? '#ffcc00'

  const grids: [string, string][] = [
    ['IRAN GRID', gridIran],
    ['ISRAEL GRID', gridIsrael],
  ]

  const sections: [string, string, string][] = [
    ['IRAN CYBER OPS', '#ff4444', iranOps],
    ['ISRAEL CYBER OPS', '#44aaff', israelOps],
    ['US CYBER COMMAND', '#4488ff', usCyberCmd],
    ['INFRASTRUCTURE HITS', '#ff8800', infraHits],
    ['ACTIVE APT GROUPS', '#aa88ff', aptGroups],
    ['COMMS DISRUPTION', '#ffcc00', comms],
    ['HACKTIVIST ACTIVITY', '#ff6600', hacktivist],
    ['PSYOPS / DISINFO', '#ff44aa', psyops],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {threatLevel && (
        <div
          style={{
            background: '#060008',
            border: `2px solid ${tc}44`,
            borderRadius: 4,
            padding: '14px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 7, color: '#440055', letterSpacing: 3, marginBottom: 5 }}>
            CYBER THREAT LEVEL
          </div>
          <div
            style={{
              fontSize: 22,
              color: tc,
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: 2,
            }}
          >
            {threatLevel}
          </div>
        </div>
      )}

      {grids.some(([, v]) => v) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {grids.map(([label, value]) => {
            const gc = GRID_COLORS[value.toUpperCase().replace(/\s+/g, '_')] ?? '#ffcc00'
            return value ? (
              <Card key={label} label={label} value={value} color={gc} />
            ) : null
          })}
        </div>
      )}

      {sections.map(([label, color, value]) =>
        value ? (
          <div
            key={label}
            style={{
              background: '#030008',
              border: `1px solid ${color}22`,
              borderLeft: `3px solid ${color}66`,
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

      {escalationRisk && (
        <div
          style={{
            background: '#0a0008',
            border: '1px solid #ff44aa28',
            borderRadius: 3,
            padding: '10px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#aa2266', letterSpacing: 2, marginBottom: 5 }}>
            CYBER → KINETIC ESCALATION RISK
          </div>
          <div style={{ fontSize: 10, color: '#ff88cc', lineHeight: 1.6 }}>{escalationRisk}</div>
        </div>
      )}

      {threatLevel && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'SEVERE'] as const).map(level => (
            <Tag
              key={level}
              color={THREAT_COLORS[level]}
              style={{
                opacity: level === threatLevel ? 1 : 0.25,
                fontSize: 7,
              }}
            >
              {level}
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
