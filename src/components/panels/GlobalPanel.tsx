import { Tag } from '../ui/Tag'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

function stanceColor(stance: string) {
  const s = stance.toUpperCase()
  if (s.includes('SUPPORT')) return '#ff4444'
  if (s.includes('OPPOS') || s.includes('CONDEMN')) return '#4488ff'
  return '#ffaa44'
}

export function GlobalPanel({ fields }: Props) {
  const reactions = [1, 2, 3, 4, 5, 6]
    .map(n => {
      const actor = getField(fields, `R${n}ACTOR`)
      if (!actor) return null
      return {
        actor,
        stance: getField(fields, `R${n}STANCE`),
        action: getField(fields, `R${n}ACTION`),
        exposure: getField(fields, `R${n}EXPOSURE`),
      }
    })
    .filter(Boolean) as { actor: string; stance: string; action: string; exposure: string }[]

  const extras: [string, string, string][] = [
    ['UN SECURITY COUNCIL', '#4488ff', getField(fields, 'UNSC')],
    ['NATO POSTURE', '#336699', getField(fields, 'NATO')],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {reactions.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            padding: '9px 6px',
            borderBottom: '1px solid #0a1808',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flexShrink: 0, width: 100 }}>
            <div
              style={{
                fontSize: 13,
                color: '#cceecc',
                fontFamily: 'monospace',
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {r.actor}
            </div>
            <Tag color={stanceColor(r.stance)}>{r.stance.slice(0, 16)}</Tag>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: '#aabbaa', lineHeight: 1.55 }}>{r.action}</div>
            {r.exposure && (
              <div style={{ fontSize: 8, color: '#446644', marginTop: 3 }}>
                EXPOSURE: {r.exposure}
              </div>
            )}
          </div>
        </div>
      ))}

      {extras.map(([label, color, value]) =>
        value ? (
          <div
            key={label}
            style={{
              background: '#00040e',
              border: `1px solid ${color}30`,
              borderRadius: 3,
              padding: '10px 12px',
              marginTop: 10,
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
