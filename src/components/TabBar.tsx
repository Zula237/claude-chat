import type { ModuleId } from '../types'
import { MODULES } from '../modules'

interface TabBarProps {
  active: ModuleId
  onChange: (id: ModuleId) => void
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        background: '#000c04',
        borderBottom: '1px solid #0a2a10',
        overflowX: 'auto',
      }}
    >
      {MODULES.map(m => (
        <button
          key={m.id}
          className={`module-tab${active === m.id ? ' active' : ''}`}
          style={{ '--module-color': m.color } as React.CSSProperties}
          onClick={() => onChange(m.id)}
          title={m.fullName}
        >
          <span className="tab-icon">{m.icon}</span>
          {m.label}
        </button>
      ))}
    </div>
  )
}
