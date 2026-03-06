import { Card } from '../ui/Card'
import { Tag } from '../ui/Tag'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

function sideColor(side: string) {
  return side.includes('IRAN') ? '#ff6600' : '#ff2020'
}

export function StrikesPanel({ fields }: Props) {
  const waves = getField(fields, 'WAVES')
  const hotspots = [1, 2, 3].map(n => getField(fields, `HOTSPOT${n}`)).filter(Boolean)

  const ops = [1, 2, 3]
    .map(n => {
      const name = getField(fields, `OP${n}NAME`)
      if (!name) return null
      return {
        name,
        side: getField(fields, `OP${n}SIDE`),
        target: getField(fields, `OP${n}TARGET`),
        status: getField(fields, `OP${n}STATUS`),
        cas: getField(fields, `OP${n}CAS`),
      }
    })
    .filter(Boolean) as { name: string; side: string; target: string; status: string; cas: string }[]

  const proxies: [string, string, string][] = [
    ['HEZBOLLAH', '#ff6600', getField(fields, 'HEZBOLLAH')],
    ['HOUTHIS', '#ff8800', getField(fields, 'HOUTHIS')],
    ['IRAQI PROXIES', '#ffaa00', getField(fields, 'PROXIES')],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {waves && <Card label="STRIKE WAVES ON IRAN" value={waves} color="#ff3333" />}

      {ops.map((op, i) => {
        const sc = sideColor(op.side)
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${sc}30`,
              borderLeft: `3px solid ${sc}`,
              background: '#060000',
              borderRadius: 3,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              <span style={{ color: '#ffcccc', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}>
                {op.name}
              </span>
              <Tag color={sc}>{op.side}</Tag>
            </div>
            <div style={{ fontSize: 9, color: '#886666', marginBottom: 4 }}>
              TARGET: <span style={{ color: '#ffaaaa' }}>{op.target}</span>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 8, flexWrap: 'wrap' }}>
              <span style={{ color: op.status === 'ONGOING' ? '#ff4444' : '#44aa66' }}>
                ● {op.status}
              </span>
              {op.cas && <span style={{ color: '#554444' }}>CAS: {op.cas}</span>}
            </div>
          </div>
        )
      })}

      {hotspots.length > 0 && (
        <div>
          <div style={{ fontSize: 7, color: '#6a2020', letterSpacing: 2, marginBottom: 7 }}>
            ACTIVE HOTSPOTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {hotspots.map((h, i) => (
              <span
                key={i}
                style={{
                  background: '#160000',
                  border: '1px solid #ff222240',
                  color: '#ff6666',
                  fontSize: 9,
                  padding: '3px 10px',
                  borderRadius: 2,
                  fontFamily: 'monospace',
                }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {proxies.map(([label, color, value]) =>
        value ? (
          <div
            key={label}
            style={{
              background: '#080000',
              border: `1px solid ${color}22`,
              borderRadius: 3,
              padding: '8px 10px',
            }}
          >
            <div style={{ fontSize: 7, color: `${color}99`, letterSpacing: 1.5, marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 10, color, lineHeight: 1.5 }}>{value}</div>
          </div>
        ) : null,
      )}
    </div>
  )
}
