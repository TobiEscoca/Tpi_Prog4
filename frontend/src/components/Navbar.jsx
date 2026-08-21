import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

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
          <span className="flex items-center justify-center w-10 h-10 shadow-md shadow-green-600/20 group-hover:shadow-lg group-hover:shadow-green-600/30 transition-shadow duration-300">
            <img src={logo} alt="Logo Nos Falta Uno" className="w-10 h-10 object-contain" />
          </span>
          <div className="flex gap-0"><p className ="text-green-600">Nos</p><p>Falta</p><p className ="text-green-600">Uno</p></div>
        
        </Link>

        {/* Links centrales */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/complejos" className="navlink">
            Complejos
          </Link>
          <Link to="/canchas" className="navlink">
            Canchas
          </Link>
          <Link to="/nosotros" className="navlink">
            Nosotros
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
              {user.rol === 'Cliente' && (
                <Link to="/notificaciones" className="navlink">
                  Notificaciones
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
