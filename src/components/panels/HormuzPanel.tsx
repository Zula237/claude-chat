import { Card } from '../ui/Card'
import type { ParsedField } from '../../types'
import { getField } from '../../utils'

interface Props { fields: ParsedField[] }

const STATUS_COLORS: Record<string, string> = {
  'CLOSED': '#ff0000',
  'EFFECTIVELY CLOSED': '#ff2020',
  'PARTIALLY CLOSED': '#ff8800',
  'CONTESTED': '#ffcc00',
  'OPEN': '#00ff55',
  'RESTRICTED': '#ff8800',
}

export function HormuzPanel({ fields }: Props) {
  const hstatus = getField(fields, 'HSTATUS')
  const traffic = getField(fields, 'TRAFFIC')
  const brent = getField(fields, 'BRENT')
  const change = getField(fields, 'CHANGE')
  const lng = getField(fields, 'LNGSTATUS')
  const attacks = getField(fields, 'ATTACKS')
  const insurance = getField(fields, 'INSURANCE')
  const reroute = getField(fields, 'REROUTE')
  const forecast = getField(fields, 'FORECAST')

  const cs = STATUS_COLORS[hstatus.toUpperCase()] ?? '#ff8800'
  const exposed = [1, 2, 3].map(n => getField(fields, `EXPOSED${n}`)).filter(Boolean)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          background: '#080400',
          border: `2px solid ${cs}44`,
          borderRadius: 4,
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 7, color: '#7a4a00', letterSpacing: 3, marginBottom: 5 }}>
          STRAIT OF HORMUZ
        </div>
        <div
          style={{
            fontSize: 22,
            color: cs,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: 2,
          }}
        >
          {hstatus || '—'}
        </div>
        {traffic && (
          <div style={{ fontSize: 9, color: '#665533', marginTop: 6 }}>
            AIS TRAFFIC: {traffic}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card label="BRENT CRUDE" value={brent} color="#ffaa33" />
        <Card label="PRICE CHANGE" value={change} color="#ff6633" />
        <Card label="QATAR LNG" value={lng ? lng.slice(0, 24) : '—'} color="#ff8844" />
        <Card label="TANKER ATTACKS" value={attacks} color="#ff4444" />
      </div>

      {insurance && (
        <div
          style={{
            background: '#060400',
            border: '1px solid #ff880018',
            borderRadius: 3,
            padding: '9px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#7a4a00', letterSpacing: 1.5, marginBottom: 4 }}>
            WAR RISK INSURANCE
          </div>
          <div style={{ fontSize: 10, color: '#cc9955', lineHeight: 1.6 }}>{insurance}</div>
        </div>
      )}

      {reroute && (
        <div
          style={{
            background: '#060400',
            border: '1px solid #ff880018',
            borderRadius: 3,
            padding: '9px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#7a4a00', letterSpacing: 1.5, marginBottom: 4 }}>
            CAPE OF GOOD HOPE REROUTING
          </div>
          <div style={{ fontSize: 10, color: '#cc9955', lineHeight: 1.6 }}>{reroute}</div>
        </div>
      )}

      {exposed.length > 0 && (
        <div
          style={{
            background: '#060400',
            border: '1px solid #ff880018',
            borderRadius: 3,
            padding: '10px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#7a4a00', letterSpacing: 2, marginBottom: 8 }}>
            MOST EXPOSED ECONOMIES
          </div>
          {exposed.map((c, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}
            >
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: `linear-gradient(90deg,#ff8800,#ff880000)`,
                  borderRadius: 2,
                  maxWidth: `${94 - i * 22}%`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: '#cc9944',
                  fontFamily: 'monospace',
                  minWidth: 55,
                }}
              >
                {c}
              </span>
            </div>
          ))}
        </div>
      )}

      {forecast && (
        <div
          style={{
            background: '#060400',
            border: '1px solid #ff880022',
            borderRadius: 3,
            padding: '9px 12px',
          }}
        >
          <div style={{ fontSize: 7, color: '#7a4a00', letterSpacing: 1.5, marginBottom: 4 }}>
            ANALYST FORECAST
          </div>
          <div style={{ fontSize: 10, color: '#cc9955', lineHeight: 1.6 }}>{forecast}</div>
        </div>
      )}
    </div>
  )
}
