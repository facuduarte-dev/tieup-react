import { useState } from 'react'
import { api } from '../api'

const emptyLogin = { email: '', password: '' }
const emptyRegister = { name: '', email: '', password: '' }

function Auth({ onAuthenticated }) {
  const [login, setLogin] = useState(emptyLogin)
  const [register, setRegister] = useState(emptyRegister)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function update(setter, field, value) {
    setter((current) => ({ ...current, [field]: value }))
  }

  async function submit(action, data) {
    setSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      const payload = await api(action, { method: 'POST', data })
      onAuthenticated(payload.user, payload.csrf_token)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell auth-page">
      <div className="page-heading centered">
        <span className="eyebrow">Bienvenido a Tie-Up</span>
        <h1>Tu próximo proyecto comienza acá</h1>
        <p>Inicia sesión o crea tu cuenta para comenzar.</p>
      </div>

      {feedback.message && (
        <p className={`feedback ${feedback.type}`} role="alert">{feedback.message}</p>
      )}

      <section className="auth-grid">
        <form
          className="form-card"
          onSubmit={(event) => {
            event.preventDefault()
            submit('login', login)
          }}
        >
          <div className="form-icon"><i className="fa-regular fa-user" /></div>
          <h2>Iniciar sesión</h2>
          <p>Accede a tu cuenta para continuar.</p>

          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            value={login.email}
            onChange={(event) => update(setLogin, 'email', event.target.value)}
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            value={login.password}
            onChange={(event) => update(setLogin, 'password', event.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>

        <form
          className="form-card"
          onSubmit={(event) => {
            event.preventDefault()
            submit('register', register)
          }}
        >
          <div className="form-icon"><i className="fa-solid fa-user-plus" /></div>
          <h2>Crear cuenta</h2>
          <p>Comparte tu talento y conecta con nuevos clientes.</p>

          <label htmlFor="register-name">Nombre completo</label>
          <input
            id="register-name"
            value={register.name}
            onChange={(event) => update(setRegister, 'name', event.target.value)}
            maxLength="80"
            required
          />

          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            type="email"
            value={register.email}
            onChange={(event) => update(setRegister, 'email', event.target.value)}
            required
          />

          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            value={register.password}
            onChange={(event) => update(setRegister, 'password', event.target.value)}
            minLength="8"
            maxLength="12"
            required
          />
          <small>8 a 12 caracteres, mayúscula, minúscula, número y símbolo.</small>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Auth
