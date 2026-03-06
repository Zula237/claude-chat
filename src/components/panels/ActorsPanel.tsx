import { Tag } from '../ui/Tag'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

const STATUS_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  KIA:      { bg: '#160000', border: '#ff2020', color: '#ff4040' },
  ACTIVE:   { bg: '#001508', border: '#00aa44', color: '#00ff66' },
  DEGRADED: { bg: '#120600', border: '#ff8800', color: '#ffaa44' },
  UNKNOWN:  { bg: '#080808', border: '#444444', color: '#777777' },
  MISSING:  { bg: '#0e0800', border: '#aa6600', color: '#cc8800' },
}

function getStatusStyle(status: string) {
  return STATUS_STYLES[status.toUpperCase()] ?? STATUS_STYLES.UNKNOWN
}

export function ActorsPanel({ fields }: Props) {
  const actors = [1, 2, 3, 4, 5]
    .map(n => {
      const name = getField(fields, `A${n}NAME`)
      if (!name) return null
      return {
        name,
        role: getField(fields, `A${n}ROLE`),
        status: getField(fields, `A${n}STATUS`),
        action: getField(fields, `A${n}ACTION`),
      }
    })
    .filter(Boolean) as { name: string; role: string; status: string; action: string }[]

  const extras: [string, string, string][] = [
    ['SUCCESSION STATUS', '#aa88ff', getField(fields, 'SUCCESSION')],
    ['IRGC COMMAND', '#ff8800', getField(fields, 'IRGC')],
    ['ACTIVE DIPLOMACY', '#44ff88', getField(fields, 'DIPLOMACY')],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {actors.map((a, i) => {
        const s = getStatusStyle(a.status)
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${s.border}33`,
              borderLeft: `3px solid ${s.border}`,
              background: s.bg,
              borderRadius: 3,
              padding: '10px 13px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              <span
                style={{
                  color: '#ddeedd',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                {a.name}
              </span>
              <Tag color={s.color}>{a.status}</Tag>
            </div>
            {a.role && (
              <div style={{ fontSize: 8, color: '#445544', marginBottom: 6 }}>{a.role}</div>
            )}
            {a.action && (
              <div style={{ fontSize: 9, color: '#aabbaa', lineHeight: 1.55 }}>{a.action}</div>
            )}
          </div>
        )
      })}

      {extras.map(([label, color, value]) =>
        value ? (
          <div
            key={label}
            style={{
              background: '#080408',
              border: `1px solid ${color}20`,
              borderRadius: 3,
              padding: '10px 12px',
            }}
          >
            <div
              style={{ fontSize: 7, color: `${color}88`, letterSpacing: 2, marginBottom: 5 }}
            >
              {label}
            </div>
            <div style={{ fontSize: 10, color: `${color}cc`, lineHeight: 1.65 }}>{value}</div>
          </div>
        ) : null,
      )}
    </div>
  )
}
