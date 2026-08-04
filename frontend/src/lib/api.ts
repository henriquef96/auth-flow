const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

export function getAuthHeaders(token?: string | null): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  throw new Error(text || 'Resposta inesperada do servidor.')
}

export async function fetchJson<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options)
  const payload = await parseJsonResponse(response)

  if (!response.ok) {
    const errorMessage = payload?.message || payload?.erro || response.statusText || 'Erro inesperado.'
    throw new Error(errorMessage)
  }

  return payload as T
}
