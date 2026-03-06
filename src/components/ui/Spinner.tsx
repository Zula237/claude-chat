import { useTick } from '../../hooks/useTick'

interface SpinnerProps {
  color?: string
  label?: string
}

const FRAMES = ['|', '/', '—', '\\']

export function Spinner({ color = '#00ff88', label = 'QUERYING INTELLIGENCE' }: SpinnerProps) {
  const t = useTick(250)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        gap: 14,
      }}
    >
      <div style={{ fontSize: 36, color, fontFamily: 'monospace', lineHeight: 1 }}>
        {FRAMES[t % 4]}
      </div>
      <div style={{ fontSize: 9, color, letterSpacing: 3 }}>{label}</div>
      <div style={{ fontSize: 8, color: '#2a4a2a', textAlign: 'center', lineHeight: 2 }}>
        Analyzing situation…
        <br />
        Compiling OSINT data…
      </div>
    </div>
  )
}
