interface ErrBoxProps {
  label: string
  error: string
  onRetry: () => void
}

export function ErrBox({ label, error, onRetry }: ErrBoxProps) {
  return (
    <div
      style={{
        border: '1px solid #ff333355',
        borderLeft: '3px solid #ff3333',
        background: '#080000',
        borderRadius: 3,
        padding: 18,
      }}
    >
      <div
        style={{
          color: '#ff5555',
          fontSize: 13,
          fontFamily: 'monospace',
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        FEED ERROR — {label}
      </div>
      <pre
        style={{
          color: '#885555',
          fontSize: 8,
          lineHeight: 1.8,
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
          marginBottom: 14,
          background: '#040000',
          padding: '8px 10px',
          borderRadius: 2,
          overflow: 'auto',
          maxHeight: 200,
        }}
      >
        {error}
      </pre>
      <button className="action-btn" onClick={onRetry}>
        RETRY
      </button>
    </div>
  )
}
