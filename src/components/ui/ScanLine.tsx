export function ScanLine() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg,transparent,#00ff6630,transparent)',
        animation: 'scandown 6s linear infinite',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
