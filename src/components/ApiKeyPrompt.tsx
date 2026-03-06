import { useState } from 'react'
import { ScanLine } from './ui/ScanLine'

interface ApiKeyPromptProps {
  onSubmit: (key: string) => void
}

export function ApiKeyPrompt({ onSubmit }: ApiKeyPromptProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Key must start with sk-ant-')
      return
    }
    onSubmit(trimmed)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#010803',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: '#00cc66',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          border: '1px solid #0a4a20',
          borderRadius: 4,
          background: '#000d04',
          padding: 32,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ScanLine />
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, color: '#00ff88', marginBottom: 4 }}>
          IRON ATLAS
        </div>
        <div style={{ fontSize: 7, color: '#0a5228', letterSpacing: 3, marginBottom: 24 }}>
          AUTHENTICATION REQUIRED // ENTER API CREDENTIALS
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 7, color: '#0a6a28', letterSpacing: 2, marginBottom: 6 }}>
              ANTHROPIC API KEY
            </div>
            <input
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError('') }}
              placeholder="sk-ant-api03-..."
              autoFocus
              style={{
                width: '100%',
                background: '#010803',
                border: '1px solid #0a4a20',
                borderRadius: 2,
                padding: '8px 12px',
                color: '#00ff88',
                fontFamily: 'monospace',
                fontSize: 11,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {error && (
            <div style={{ color: '#ff5555', fontSize: 8 }}>{error}</div>
          )}
          <div style={{ fontSize: 7, color: '#0a4020', lineHeight: 1.8 }}>
            Key is stored in localStorage and never transmitted to any server other than api.anthropic.com.
            Set VITE_ANTHROPIC_API_KEY in .env to skip this prompt.
          </div>
          <button type="submit" className="action-btn" style={{ alignSelf: 'flex-start' }}>
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  )
}
