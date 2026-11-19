import { useEffect, useState } from 'react'
import { api } from '../api'

function Catalog({ user, onNavigate }) {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    api('services')
      .then((payload) => {
        if (active) setServices(payload.services)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredServices = services.filter((service) =>
    `${service.title} ${service.category} ${service.specialty} ${service.professional_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <main className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Talento disponible</span>
        <h1>Catálogo de servicios</h1>
        <p>Encuentra profesionales para tu próximo proyecto.</p>
      </div>

      <div className="catalog-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por servicio, categoría o profesional"
        />
        <button type="button" onClick={() => onNavigate(user ? 'my-services' : 'auth')}>
          {user ? 'Publicar un servicio' : 'Iniciar sesión para publicar'}
        </button>
      </div>

      {loading && <p className="feedback info">Cargando servicios…</p>}
      {error && <p className="feedback error" role="alert">{error}</p>}

      {!loading && !error && filteredServices.length === 0 && (
        <div className="empty-state">
          <h2>No encontramos servicios</h2>
          <p>Prueba con otra búsqueda o publica el primero.</p>
        </div>
      )}

      <section className="react-catalog-grid">
        {filteredServices.map((service) => (
          <article className="react-service-card" key={service.id}>
            <span className="pill">{service.category}</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <dl>
              <div><dt>Especialidad</dt><dd>{service.specialty}</dd></div>
              <div><dt>Profesional</dt><dd>{service.professional_name}</dd></div>
              <div><dt>Entrega</dt><dd>{service.delivery_time}</dd></div>
            </dl>
            <strong className="price">US$ {Number(service.price).toFixed(2)}</strong>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Catalog
