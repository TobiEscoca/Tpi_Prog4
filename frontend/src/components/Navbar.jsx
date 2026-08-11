import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const puedeGestionar = user && user.rol === 'DuenoComplejo'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md px-6 md:px-10 py-4 shadow-sm shadow-black/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-base font-bold text-gray-900 tracking-tight group">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-600 text-white shadow-md shadow-green-600/20 group-hover:shadow-lg group-hover:shadow-green-600/30 transition-shadow duration-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </span>
          Gestor de Turnos
        </Link>

        {/* Links centrales */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/complejos" className="navlink">
            Complejos
          </Link>
          <Link to="/canchas" className="navlink">
            Canchas
          </Link>
          <Link to="/turnos" className="navlink">
            Turnos
          </Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm box-decoration-clone bg-linear-to-r from-green-400 to-green-600 px-2 font-medium text-white"><strong>{user.nombre}</strong></span>
              {puedeGestionar && (
                <Link to="/dashboard" className="button-authl">
                  Mi gestión
                </Link>
              )}
              {user.rol === 'AdministradorGeneral' && (
                <Link to="/dashboardadmin" className="button-authl">
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="button-authl cursor-pointer">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="button-authr">
                Registrarse
              </Link>
              <Link to="/login" className="button-authl">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
