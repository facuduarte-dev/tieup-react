import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

function Admin({ csrfToken }) {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState('')

  const loadDashboard = useCallback(async () => {
    try {
      setDashboard(await api('admin'))
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  useEffect(() => {
    let active = true

    api('admin')
      .then((payload) => {
        if (active) setDashboard(payload)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })

    return () => {
      active = false
    }
  }, [])

  async function update(action, id, status) {
    setUpdating(`${action}-${id}`)
    try {
      await api(action, {
        method: 'POST',
        data: { id, status, csrf_token: csrfToken },
      })
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdating('')
    }
  }

  return (
    <main className="page-shell admin-react-page">
      <div className="page-heading">
        <span className="eyebrow">Gestión privada</span>
        <h1>Panel administrativo</h1>
        <p>Controla la actividad principal de Tie-Up.</p>
      </div>

      {error && <p className="feedback error" role="alert">{error}</p>}
      {!dashboard && !error && <p className="feedback info">Cargando panel…</p>}

      {dashboard && (
        <>
          <section className="stats-grid">
            <article><span>Usuarios</span><strong>{dashboard.counts.users}</strong></article>
            <article><span>Servicios</span><strong>{dashboard.counts.services}</strong></article>
            <article><span>Mensajes pendientes</span><strong>{dashboard.counts.pending}</strong></article>
          </section>

          <section className="admin-table-card">
            <h2>Mensajes de contacto</h2>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Usuario</th><th>Correo</th><th>Asunto</th><th>Mensaje</th><th>Estado</th></tr></thead>
                <tbody>
                  {dashboard.messages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.user_name}</td>
                      <td>{message.email}</td>
                      <td>{message.topic}</td>
                      <td>{message.message}</td>
                      <td>
                        <select
                          value={message.status}
                          disabled={updating === `update-contact-${message.id}`}
                          onChange={(event) => update('update-contact', message.id, event.target.value)}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="read">Leído</option>
                          <option value="answered">Respondido</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-table-card">
            <h2>Servicios publicados</h2>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Profesional</th><th>Servicio</th><th>Categoría</th><th>Precio</th><th>Estado</th></tr></thead>
                <tbody>
                  {dashboard.services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.professional_name}</td>
                      <td>{service.title}</td>
                      <td>{service.category}</td>
                      <td>US$ {Number(service.price).toFixed(2)}</td>
                      <td>
                        <select
                          value={service.status}
                          disabled={updating === `update-service-${service.id}`}
                          onChange={(event) => update('update-service', service.id, event.target.value)}
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default Admin
