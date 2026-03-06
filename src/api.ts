import { parseFields } from './utils'
import type { CachedEntry } from './types'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

export interface StreamCallbacks {
  onChunk: (chunk: string) => void
  onComplete: (entry: CachedEntry) => void
  onError: (err: string) => void
}

export async function fetchModuleStream(
  prompt: string,
  apiKey: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  if (!apiKey) {
    callbacks.onError('No API key configured.')
    return
  }

  let response: Response
  try {
    response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (e) {
    if ((e as Error).name === 'AbortError') return
    callbacks.onError(`Network error: ${(e as Error).message}`)
    return
  }

  if (!response.ok) {
    let body = ''
    try { body = await response.text() } catch { /* ignore */ }
    callbacks.onError(`API ${response.status}: ${body.slice(0, 300)}`)
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    callbacks.onError('No response body stream.')
    return
  }

  const decoder = new TextDecoder()
  let sseBuffer = ''
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      sseBuffer += decoder.decode(value, { stream: true })

      const lines = sseBuffer.split('\n')
      sseBuffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const json = line.slice(6).trim()
        if (json === '[DONE]') continue
        try {
          const evt = JSON.parse(json)
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            const text: string = evt.delta.text ?? ''
            fullText += text
            callbacks.onChunk(text)
          }
        } catch { /* malformed SSE line */ }
      }
    }
  } finally {
    reader.releaseLock()
  }

  if (!fullText.trim()) {
    callbacks.onError('Empty response from API.')
    return
  }

  const fields = parseFields(fullText)
  if (fields.length < 2) {
    callbacks.onError(`Too few fields parsed (${fields.length}). Raw:\n${fullText.slice(0, 400)}`)
    return
  }

  callbacks.onComplete({ raw: fullText, fields, fetchedAt: Date.now() })
}
