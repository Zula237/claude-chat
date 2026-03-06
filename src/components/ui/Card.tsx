interface CardProps {
  label: string
  value: string
  color: string
  sub?: string
}

export function Card({ label, value, color, sub }: CardProps) {
  return (
    <div
      style={{
        background: '#020d06',
        border: `1px solid ${color}22`,
        borderRadius: 3,
        padding: '8px 10px',
      }}
    >
      <div style={{ fontSize: 7, color: '#0a5a20', letterSpacing: 1.5, marginBottom: 3 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          lineHeight: 1.2,
        }}
      >
        {value || '–'}
      </div>
      {sub && (
        <div style={{ fontSize: 7, color: '#446644', marginTop: 3 }}>{sub}</div>
      )}
    </div>
  )
}
