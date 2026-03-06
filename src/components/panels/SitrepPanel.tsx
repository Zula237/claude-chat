import { Card } from '../ui/Card'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

const THREAT_COLORS: Record<string, string> = {
  CRITICAL: '#ff2020',
  HIGH: '#ff7700',
  ELEVATED: '#ffcc00',
  MODERATE: '#88ff44',
}

export function SitrepPanel({ fields }: Props) {
  const day = getField(fields, 'DAY')
  const threat = getField(fields, 'THREAT')
  const status = getField(fields, 'STATUS')
  const score = getField(fields, 'SCORE')
  const headline = getField(fields, 'HEADLINE')
  const risk = getField(fields, 'RISK')
  const tc = THREAT_COLORS[threat] ?? '#ff7700'

  const facts = [1, 2, 3, 4, 5]
    .map(n => getField(fields, `FACT${n}`))
    .filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card label="DAY OF CONFLICT" value={day} color="#ff3333" />
        <Card label="THREAT LEVEL" value={threat} color={tc} />
        <Card label="STATUS" value={status} color="#ff8800" />
        <Card label="ESC SCORE" value={score ? `${score}/10` : '—'} color="#ff2020" />
      </div>

      {headline && (
        <div
          style={{
            background: '#030f08',
            border: '1px solid #0a3a18',
            borderRadius: 3,
            padding: '12px 14px',
          }}
        >
          <div style={{ fontSize: 7, color: '#0a6a28', letterSpacing: 2, marginBottom: 7 }}>
            LIVE HEADLINE
          </div>
          <div style={{ fontSize: 15, color: '#eeffee', lineHeight: 1.5, fontFamily: 'monospace' }}>
            {headline}
          </div>
        </div>
      )}

      {facts.length > 0 && (
        <div>
          <div style={{ fontSize: 7, color: '#0a6a28', letterSpacing: 2, marginBottom: 8 }}>
            KEY INTELLIGENCE
          </div>
          {facts.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                padding: '7px 0',
                borderBottom: '1px solid #0a1a08',
              }}
            >
              <span
                style={{
                  color: '#00ff44',
                  fontSize: 9,
                  flexShrink: 0,
                  minWidth: 22,
                  fontFamily: 'monospace',
                }}
              >
                {String(i + 1).padStart(2, '0')}.
              </span>
              <span style={{ fontSize: 10, color: '#aaccaa', lineHeight: 1.65 }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      {risk && (
        <div
          style={{
            background: '#0f0400',
            border: '1px solid #ff440028',
            borderRadius: 3,
            padding: '10px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#993300', letterSpacing: 2, marginBottom: 5 }}>
            NEXT ESCALATION VECTOR
          </div>
          <div style={{ fontSize: 10, color: '#ff9944', lineHeight: 1.6 }}>{risk}</div>
        </div>
      )}
    </div>
  )
}
