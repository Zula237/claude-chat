export type ModuleId =
  | 'SITREP'
  | 'STRIKES'
  | 'HORMUZ'
  | 'ACTORS'
  | 'GLOBAL'
  | 'CYBER'
  | 'NUCLEAR'

export interface ParsedField {
  key: string
  value: string
}

export interface CachedEntry {
  raw: string
  fields: ParsedField[]
  fetchedAt: number
}

export interface ModuleState {
  data: CachedEntry | null
  loading: boolean
  streaming: boolean
  streamBuffer: string
  error: string | null
  refresh: () => void
  lastUpdated: number | null
}

export interface ModuleConfig {
  id: ModuleId
  label: string
  fullName: string
  color: string
  icon: string
  prompt: string
}
