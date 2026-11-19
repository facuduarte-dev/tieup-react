import { useState } from 'react'
import { api } from '../api'

function Support({ user, csrfToken }) {
  const [form, setForm] = useState({
    topic: '',
    message: '',
    email: user?.email || '',
  })
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      const payload = await api('contact', {
        method: 'POST',
        data: { ...form, csrf_token: csrfToken },
      })
      setFeedback({ type: 'success', message: payload.message })
      setForm((current) => ({ ...current, topic: '', message: '' }))
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell support-react-page">
      <div className="page-heading centered">
        <span className="eyebrow"><i className="fa-solid fa-headset" /> Estamos para ayudarte</span>
        <h1>Contacta con soporte</h1>
        <p>¿Tienes dudas, problemas o sugerencias? Nuestro equipo está listo para ayudarte.</p>
      </div>

      {feedback.message && (
        <p className={`feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.message}
        </p>
      )}

      <form className="form-card support-form" onSubmit={submit}>
        <label htmlFor="support-topic">¿En qué te podemos ayudar?</label>
        <input
          id="support-topic"
          value={form.topic}
          onChange={(event) => update('topic', event.target.value)}
          maxLength="150"
          required
        />

        <label htmlFor="support-message">Describe tu consulta</label>
        <textarea
          id="support-message"
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          maxLength="5000"
          rows="7"
          required
        />

        <label htmlFor="support-email">Correo electrónico</label>
        <input
          id="support-email"
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          maxLength="150"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </form>
    </main>
  )
}

export default Support
