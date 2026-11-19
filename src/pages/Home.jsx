import { useState } from 'react'
import heroImage from '../assets/imgHero.png'
import freelancerImage from '../assets/freelancer.jpg'

const categories = [
  { icon: 'fa-bullhorn', title: 'Marketing', text: 'SEO, Ads y Social Media' },
  { icon: 'fa-code', title: 'Desarrollo Web', text: 'Frontend, Backend y Full Stack' },
  { icon: 'fa-palette', title: 'Diseño', text: 'Logos, Branding y UI/UX' },
  { icon: 'fa-video', title: 'Edición', text: 'Videos para YouTube y redes' },
  { icon: 'fa-pen-nib', title: 'Redacción', text: 'Copywriting y blogs' },
  { icon: 'fa-robot', title: 'IA', text: 'Automatizaciones y chatbots' },
]

const freelancers = [
  { name: 'Ana García', role: 'Diseñadora web', image: freelancerImage },
  { name: 'Pedro Sánchez', role: 'Full Stack Developer', image: freelancerImage },
  { name: 'Alonso Mazza', role: 'Marketing digital', image: freelancerImage },
]

const steps = [
  ['fa-magnifying-glass', 'Buscar', 'Encuentra tu servicio ideal.'],
  ['fa-code-compare', 'Comparar', 'Revisa perfiles, experiencia y valoraciones.'],
  ['fa-comments', 'Contactar', 'Habla directamente con el profesional.'],
  ['fa-handshake', 'Contratar', 'Comienza tu proyecto de forma rápida y segura.'],
]

const reviews = [
  ['Encontré un diseñador excelente en menos de una hora.', 'Ana Gómez'],
  ['Excelente plataforma para encontrar desarrolladores.', 'Carlos Fernández'],
  ['Muy fácil de usar y con profesionales de calidad.', 'Lucía Rodríguez'],
]

function Home({ onNavigate }) {
  const [search, setSearch] = useState('')

  const visibleCategories = categories.filter((category) =>
    `${category.title} ${category.text}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main id="inicio">
      <section className="hero">
        <div className="heroTxt">
          <h1>Encuentra al profesional perfecto para cualquier proyecto digital.</h1>
          <p>Diseñadores, programadores, editores, marketers y creadores de contenido en un solo lugar.</p>

          <div className="divHeroNav">
            <label className="sr-only" htmlFor="buscarServicio">Buscar servicio</label>
            <input
              id="buscarServicio"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="¿Qué servicio estás buscando?"
            />
            <div>
              <button id="aHero1" type="button" onClick={() => onNavigate('catalog')}>
                Explorar servicios
              </button>
              <button id="aHero2" type="button" onClick={() => onNavigate('my-services')}>
                Publicar servicios
              </button>
            </div>
          </div>
        </div>

        <img className="heroImg" src={heroImage} alt="Profesionales colaborando" />
      </section>

      <section id="servicios" className="home-section">
        <h2 id="titleCatPopulares">Categorías populares</h2>
        <div className="cardContainer">
          {visibleCategories.map((category) => (
            <article className="card" key={category.title}>
              <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
              <h2>{category.title}</h2>
              <p>{category.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="freelancers" className="home-section">
        <h2 id="titleDestacados">Freelancers destacados</h2>
        <div className="cardDestacadosContainer">
          {freelancers.map((freelancer) => (
            <article className="cardDestacado" key={freelancer.name}>
              <img src={freelancer.image} alt={freelancer.name} />
              <h2>{freelancer.name}</h2>
              <p>{freelancer.role}</p>
              <button type="button" onClick={() => onNavigate('profile')}>Ver perfil</button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 id="titleComoFunciona">¿Cómo funciona?</h2>
        <div className="ComoFuncionaContainer">
          {steps.map(([icon, title, text]) => (
            <article className="ComoFunciona" key={title}>
              <i className={`fa-solid ${icon}`} aria-hidden="true" />
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reseñas home-section" id="resenas">
        <h2 id="titleResenas">Lo que dicen nuestros usuarios</h2>
        <div className="reseñasCardContainer">
          {reviews.map(([text, author]) => (
            <article className="cardReseña" key={author}>
              <p>“{text}”</p>
              <strong>{author}</strong>
            </article>
          ))}
        </div>
      </section>

      <footer id="contacto" className="react-footer">
        <div>
          <h2>Tie-Up</h2>
          <p>Conectando talento con oportunidades.</p>
        </div>
        <div>
          <strong>Explorar</strong>
          <button type="button" onClick={() => onNavigate('catalog')}>Servicios</button>
          <button type="button" onClick={() => onNavigate('support')}>Contacto</button>
        </div>
        <div>
          <strong>Recursos</strong>
          <span>Ayuda</span>
          <span>Preguntas frecuentes</span>
        </div>
      </footer>
    </main>
  )
}

export default Home
