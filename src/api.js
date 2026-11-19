const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost/sofka-migracion-react/api/index.php'

export async function api(action, options = {}) {
  const { method = 'GET', data } = options
  const response = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, {
    method,
    credentials: 'include',
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  })

  const payload = await response.json().catch(() => ({
    ok: false,
    message: 'El servidor devolvió una respuesta inválida',
  }))

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.message || 'No se pudo completar la solicitud')
  }

  return payload
}
