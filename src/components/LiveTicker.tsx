import { useTick } from '../hooks/useTick'
import type { ParsedField } from '../types'
import { getField } from '../utils'

interface LiveTickerProps {
  sitrepFields: ParsedField[] | null
  nextRefreshSec: number
}

export function LiveTicker({ sitrepFields, nextRefreshSec }: LiveTickerProps) {
  const t = useTick(1000)
  const blink = t % 2 === 0

  if (!sitrepFields) return null

  const day = getField(sitrepFields, 'DAY')
  const headline = getField(sitrepFields, 'HEADLINE')

  return (
    <div
      style={{
        background: '#000a03',
        borderBottom: '1px solid #0a1a08',
        padding: '5px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          background: '#150000',
          border: '1px solid #ff2020',
          color: blink ? '#ff3333' : '#660000',
          fontSize: 7,
          padding: '2px 7px',
          letterSpacing: 2,
          flexShrink: 0,
          transition: 'color 0.5s',
          fontFamily: 'monospace',
        }}
      >
        LIVE
      </span>
      <span
        style={{
          color: '#ffaa44',
          fontSize: 10,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {day ? `DAY ${day} > ` : ''}{headline || 'Loading situation report…'}
      </span>
      <span
        style={{
          color: '#0a4020',
          fontSize: 7,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        REFRESH IN {nextRefreshSec}s
      </span>
    </div>
  )
}
