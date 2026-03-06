import type { ParsedField } from '../../types'

interface RawDataViewProps {
  fields: ParsedField[]
  raw: string
}

export function RawDataView({ fields, raw }: RawDataViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontSize: 7, color: '#0a6a28', letterSpacing: 2, marginBottom: 8 }}>
          PARSED FIELDS ({fields.length})
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace' }}>
          <tbody>
            {fields.map(f => (
              <tr key={f.key} style={{ borderBottom: '1px solid #0a1808' }}>
                <td
                  style={{
                    padding: '5px 10px 5px 0',
                    fontSize: 8,
                    color: '#00cc66',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'top',
                    width: '30%',
                  }}
                >
                  {f.key}
                </td>
                <td
                  style={{
                    padding: '5px 0',
                    fontSize: 9,
                    color: '#aabbaa',
                    lineHeight: 1.5,
                  }}
                >
                  {f.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div style={{ fontSize: 7, color: '#0a6a28', letterSpacing: 2, marginBottom: 8 }}>
          RAW RESPONSE
        </div>
        <pre
          style={{
            background: '#010803',
            border: '1px solid #0a2010',
            borderRadius: 3,
            padding: '10px 12px',
            fontSize: 8,
            color: '#446644',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {raw}
        </pre>
      </div>
    </div>
  )
}
