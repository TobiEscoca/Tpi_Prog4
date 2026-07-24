import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white px-6 md:px-10 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-base font-semibold text-black tracking-tight">
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
          <Link
            to="/register"
            className="button-authr"
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="button-authl"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
