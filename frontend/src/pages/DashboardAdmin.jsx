import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UsuariosAdmin from './admin/UsuariosAdmin'
import ComplejosAdmin from './admin/ComplejosAdmin'
import CanchasAdmin from './admin/CanchasAdmin'
import TurnosAdmin from './admin/TurnosAdmin'
import NotificacionesAdmin from './admin/NotificacionesAdmin'

const TABS = [
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: 'complejos',
    label: 'Complejos',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4" />
      </svg>
    ),
  },
  {
    id: 'canchas',
    label: 'Canchas',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'turnos',
    label: 'Turnos',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
]

const DashboardAdmin = () => {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('usuarios')

  if (!user || user.rol !== 'AdministradorGeneral') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shrink-0 min-h-screen">
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-lg font-bold">Administrador</h1>
          <p className="text-xs text-gray-400 mt-1">{user.nombre}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === t.id ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-1">
          <Link
            to="/"
            className="block w-full text-center text-sm font-medium text-gray-300 hover:text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Volver al inicio
          </Link>
          <button
            onClick={logout}
            className="w-full text-center text-sm font-medium text-red-400 hover:text-red-300 py-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {tab === 'usuarios' && <UsuariosAdmin />}
        {tab === 'complejos' && <ComplejosAdmin />}
        {tab === 'canchas' && <CanchasAdmin />}
        {tab === 'turnos' && <TurnosAdmin />}
        {tab === 'notificaciones' && <NotificacionesAdmin />}
      </main>
    </div>
  )
}

export default DashboardAdmin
