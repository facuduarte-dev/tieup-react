import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'

const emptyForm = {
  title: '',
  category: '',
  specialty: '',
  description: '',
  price: '',
  delivery_time: '',
}

function MyServices({ csrfToken }) {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const loadServices = useCallback(async () => {
    try {
      const payload = await api('my-services')
      setServices(payload.services)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    api('my-services')
      .then((payload) => {
        if (active) setServices(payload.services)
      })
      .catch((error) => {
        if (active) setFeedback({ type: 'error', message: error.message })
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      const payload = await api('create-service', {
        method: 'POST',
        data: { ...form, csrf_token: csrfToken },
      })
      setFeedback({ type: 'success', message: payload.message })
      setForm(emptyForm)
      await loadServices()
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Comparte tu talento</span>
        <h1>Mis servicios</h1>
        <p>Publica una propuesta y consulta todo lo que ya ofrecés.</p>
      </div>

      {feedback.message && (
        <p className={`feedback ${feedback.type}`}>{feedback.message}</p>
      )}

      <form className="form-card service-form" onSubmit={submit}>
        <label htmlFor="service-title">Título del servicio</label>
        <input id="service-title" value={form.title} onChange={(event) => update('title', event.target.value)} maxLength="120" required />

        <div className="form-row">
          <div>
            <label htmlFor="service-category">Categoría</label>
            <input id="service-category" value={form.category} onChange={(event) => update('category', event.target.value)} maxLength="80" required />
          </div>
          <div>
            <label htmlFor="service-specialty">Especialidad</label>
            <input id="service-specialty" value={form.specialty} onChange={(event) => update('specialty', event.target.value)} maxLength="100" required />
          </div>
        </div>

        <label htmlFor="service-description">Descripción</label>
        <textarea id="service-description" value={form.description} onChange={(event) => update('description', event.target.value)} maxLength="2000" rows="5" required />

        <div className="form-row">
          <div>
            <label htmlFor="service-price">Precio (USD)</label>
            <input id="service-price" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} required />
          </div>
          <div>
            <label htmlFor="delivery-time">Plazo de entrega</label>
            <input id="delivery-time" value={form.delivery_time} onChange={(event) => update('delivery_time', event.target.value)} maxLength="80" required />
          </div>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Publicando…' : 'Publicar servicio'}
        </button>
      </form>

      <section className="content-section">
        <h2>Tus servicios publicados</h2>
        {loading && <p>Cargando…</p>}
        {!loading && services.length === 0 && <p>Todavía no publicaste ningún servicio.</p>}
        <div className="react-catalog-grid">
          {services.map((service) => (
            <article className="react-service-card" key={service.id}>
              <div className="card-heading">
                <span className="pill">{service.category}</span>
                <span className={`status ${service.status}`}>{service.status === 'active' ? 'Activo' : 'Inactivo'}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <strong className="price">US$ {Number(service.price).toFixed(2)}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MyServices
