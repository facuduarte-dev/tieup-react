import avatar from '../assets/avatar.svg'

function Account({ user, onNavigate }) {
  return (
    <main className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Área privada</span>
        <h1>Mi cuenta</h1>
        <p>Consulta tu información y gestiona tu actividad en Tie-Up.</p>
      </div>

      <section className="account-grid">
        <article className="profile-summary">
          <img src={avatar} alt="Avatar de usuario" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="pill">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
        </article>

        <div className="account-actions">
          <button type="button" onClick={() => onNavigate('my-services')}>
            <i className="fa-solid fa-briefcase" />
            <span><strong>Mis servicios</strong><small>Publica y consulta tus servicios.</small></span>
          </button>
          <button type="button" onClick={() => onNavigate('contracts')}>
            <i className="fa-solid fa-handshake" />
            <span><strong>Mis contrataciones</strong><small>Consulta tus proyectos y su estado.</small></span>
          </button>
          {user.role === 'admin' && (
            <button type="button" onClick={() => onNavigate('admin')}>
              <i className="fa-solid fa-shield-halved" />
              <span><strong>Panel administrativo</strong><small>Gestiona servicios y mensajes.</small></span>
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default Account
