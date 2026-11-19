import { useState } from 'react'
import logo from '../assets/logo-tie-up-transparente.png'

function Navbar({ user, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(view, section) {
    setMenuOpen(false)
    onNavigate(view, section)
  }

  return (
    <header className="site-header">
      <nav className={`navBar ${menuOpen ? 'menu-abierto' : ''}`}>
        <button className="brand-button" type="button" onClick={() => navigate('home')}>
          <img src={logo} alt="Tie-Up" />
        </button>

        <div className="navLinks">
          <ul>
            <li><button type="button" onClick={() => navigate('home')}>Inicio</button></li>
            <li><button type="button" onClick={() => navigate('catalog')}>Servicios</button></li>
            <li><button type="button" onClick={() => navigate('home', 'freelancers')}>Freelancers</button></li>
            <li><button type="button" onClick={() => navigate('home', 'resenas')}>Reseñas</button></li>
            <li><button type="button" onClick={() => navigate('support')}>Soporte</button></li>
          </ul>
        </div>

        <div className="navSession">
          {user ? (
            <>
              <button type="button" onClick={() => navigate('account')}>Mi cuenta</button>
              <button type="button" onClick={onLogout}>Cerrar sesión</button>
            </>
          ) : (
            <button type="button" onClick={() => navigate('auth')}>
              Registrarse / Iniciar sesión
            </button>
          )}
        </div>

        <button
          className="menu-hamburguesa"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
    </header>
  )
}

export default Navbar
