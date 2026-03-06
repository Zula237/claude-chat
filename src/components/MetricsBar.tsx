import type { ParsedField } from '../types'
import { getField } from '../utils'

interface MetricsBarProps {
  sitrepFields: ParsedField[] | null
  hormuzFields: ParsedField[] | null
}

export function MetricsBar({ sitrepFields, hormuzFields }: MetricsBarProps) {
  const score = sitrepFields ? getField(sitrepFields, 'SCORE') : ''
  const threat = sitrepFields ? getField(sitrepFields, 'THREAT') : ''
  const status = sitrepFields ? getField(sitrepFields, 'STATUS') : ''
  const brent = hormuzFields ? getField(hormuzFields, 'BRENT') : ''
  const hstatus = hormuzFields ? getField(hormuzFields, 'HSTATUS') : ''
  const lng = hormuzFields ? getField(hormuzFields, 'LNGSTATUS') : ''

  const metrics: [string, string, string][] = [
    ['ESC INDEX', score ? `${score}/10` : '—', '#ff2020'],
    ['THREAT', threat || '—', '#ff4444'],
    ['STATUS', status || '—', '#ff8800'],
    ['BRENT CRUDE', brent || '—', '#ffaa33'],
    ['HORMUZ', hstatus || '—', '#ff3333'],
    ['QATAR LNG', lng ? lng.slice(0, 14) : '—', '#ff6633'],
  ]

  return (
    <div
      style={{
        display: 'flex',
        background: '#010a03',
        borderBottom: '1px solid #0a1a08',
        overflowX: 'auto',
      }}
    >
      {metrics.map(([label, value, color]) => (
        <div
          key={label}
          style={{
            flex: '0 0 auto',
            padding: '6px 16px',
            borderRight: '1px solid #0a1608',
            textAlign: 'center',
            minWidth: 90,
          }}
        >
          <div style={{ fontSize: 6, color: '#0a4020', letterSpacing: 1, marginBottom: 3 }}>
            {label}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color,
              fontFamily: 'monospace',
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
