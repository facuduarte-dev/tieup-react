import freelancerImage from '../assets/freelancer.jpg'

export function Profile() {
  return (
    <main className="page-shell">
      <div className="profile-page-card">
        <img src={freelancerImage} alt="Ana García" />
        <div>
          <span className="eyebrow">Perfil profesional</span>
          <h1>Ana García</h1>
          <h2>Diseñadora UX/UI</h2>
          <p>Diseñadora especializada en crear experiencias digitales claras, accesibles y centradas en las necesidades de los usuarios.</p>
          <div className="skills"><span>Figma</span><span>UI/UX</span><span>Branding</span><span>Adobe Creative Suite</span></div>
        </div>
      </div>
    </main>
  )
}

export function Contracts() {
  return (
    <main className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">Tus proyectos</span>
        <h1>Mis contrataciones</h1>
        <p>Consulta tus proyectos y su estado.</p>
      </div>
      <article className="contract-card">
        <div><span className="status active">En curso</span><h2>Diseño de sitio web</h2></div>
        <p>Entrega estimada: 20 de septiembre</p>
      </article>
    </main>
  )
}
