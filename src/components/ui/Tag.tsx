import type { CSSProperties, ReactNode } from 'react'

interface TagProps {
  color: string
  children: ReactNode
  style?: CSSProperties
}

export function Tag({ color, children, style }: TagProps) {
  return (
    <span
      style={{
        background: `${color}18`,
        border: `1px solid ${color}44`,
        color,
        fontSize: 7,
        padding: '2px 6px',
        borderRadius: 2,
        letterSpacing: 1,
        display: 'inline-block',
        fontFamily: 'monospace',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
