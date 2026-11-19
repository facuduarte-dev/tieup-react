import { useEffect, useState } from 'react'
import { api } from './api'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Auth from './pages/Auth'
import Support from './pages/Support'
import Account from './pages/Account'
import MyServices from './pages/MyServices'
import Admin from './pages/Admin'
import { Contracts, Profile } from './pages/StaticPages'
import './styles/style.css'
import './styles/navbar.css'
import './styles/react.css'

const validViews = new Set([
  'home',
  'catalog',
  'auth',
  'support',
  'account',
  'my-services',
  'admin',
  'profile',
  'contracts',
])

function viewFromHash() {
  const view = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return validViews.has(view) ? view : 'home'
}

function App() {
  const [view, setView] = useState(viewFromHash)
  const [user, setUser] = useState(null)
  const [csrfToken, setCsrfToken] = useState('')
  const [booting, setBooting] = useState(true)
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    function syncRoute() {
      setView(viewFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    api('bootstrap')
      .then((payload) => {
        setUser(payload.user)
        setCsrfToken(payload.csrf_token)
      })
      .catch((error) => setGlobalError(error.message))
      .finally(() => setBooting(false))
  }, [])

  function navigate(nextView, section) {
    if (view === nextView) {
      setView(nextView)
    }

    window.location.hash = `#/${nextView}`

    if (section) {
      window.setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  async function logout() {
    try {
      await api('logout', { method: 'POST' })
      setUser(null)
      const payload = await api('bootstrap')
      setCsrfToken(payload.csrf_token)
      navigate('home')
    } catch (error) {
      setGlobalError(error.message)
    }
  }

  function authenticated(nextUser, nextCsrfToken) {
    setUser(nextUser)
    setCsrfToken(nextCsrfToken)
    navigate('account')
  }

  function protectedPage(page, role) {
    if (!user) {
      return (
        <main className="page-shell">
          <div className="empty-state">
            <h1>Inicia sesión para continuar</h1>
            <button type="button" onClick={() => navigate('auth')}>Ir al acceso</button>
          </div>
        </main>
      )
    }

    if (role && user.role !== role) {
      return (
        <main className="page-shell">
          <p className="feedback error">No tienes permiso para acceder a esta sección.</p>
        </main>
      )
    }

    return page
  }

  function renderView() {
    switch (view) {
      case 'catalog':
        return <Catalog user={user} onNavigate={navigate} />
      case 'auth':
        return user ? <Account user={user} onNavigate={navigate} /> : <Auth onAuthenticated={authenticated} />
      case 'support':
        return <Support user={user} csrfToken={csrfToken} />
      case 'account':
        return protectedPage(<Account user={user} onNavigate={navigate} />)
      case 'my-services':
        return protectedPage(<MyServices csrfToken={csrfToken} />)
      case 'admin':
        return protectedPage(<Admin csrfToken={csrfToken} />, 'admin')
      case 'profile':
        return <Profile />
      case 'contracts':
        return protectedPage(<Contracts />)
      default:
        return <Home onNavigate={navigate} />
    }
  }

  if (booting) {
    return <div className="app-loading"><span className="loader" /><p>Preparando Tie-Up…</p></div>
  }

  return (
    <div className="react-app">
      <Navbar user={user} onNavigate={navigate} onLogout={logout} />
      {globalError && (
        <button className="global-error" type="button" onClick={() => setGlobalError('')}>
          {globalError} · cerrar
        </button>
      )}
      {renderView()}
    </div>
  )
}

export default App
