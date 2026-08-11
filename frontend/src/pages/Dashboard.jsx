import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ResumenSection from '../components/dashboard/ResumenSection'
import ComplejosSection from '../components/dashboard/ComplejosSection'
import CanchasSection from '../components/dashboard/CanchasSection'
import TurnosSection from '../components/dashboard/TurnosSection'
import { api } from '../services/api'

const TABS = [
  {
    id: 'resumen',
    label: 'Resumen',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
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
]

function Dashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('resumen')
  const [complejos, setComplejos] = useState([])
  const [cargandoComplejos, setCargandoComplejos] = useState(true)
  const [complejoSeleccionado, setComplejoSeleccionado] = useState(null)
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null)
  const [version, setVersion] = useState(0)
  const [toast, setToast] = useState(null)

  const cargarComplejos = useCallback(async () => {
    try {
      const data = await api.get('/api/Complejo/MisComplejos')
      setComplejos(data)
    } catch {
      setComplejos([])
    } finally {
      setCargandoComplejos(false)
    }
  }, [])

  useEffect(() => {
    cargarComplejos()
  }, [cargarComplejos])

  const notificarCambio = useCallback(() => setVersion((v) => v + 1), [])

  const mostrarToast = useCallback((mensaje, tipo = 'exito') => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const irATurnos = useCallback((idCancha) => {
    setCanchaSeleccionada(idCancha)
    setTab('turnos')
  }, [])

  const irACanchas = useCallback((idComplejo) => {
    setComplejoSeleccionado(idComplejo)
    setTab('canchas')
  }, [])

  const cambiarComplejo = useCallback((idComplejo) => {
    setComplejoSeleccionado(idComplejo)
    setCanchaSeleccionada(null)
  }, [])

  const cambiarCancha = useCallback((idCancha) => {
    setCanchaSeleccionada(idCancha)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shrink-0 min-h-screen">
        <div className="px-6 py-5 border-b border-gray-700">
          <h1 className="text-lg font-bold">Mi gestión</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.nombre}</p>
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
        {toast && (
          <div className={`fixed top-24 right-6 z-50 animate-slide-in-right px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
            toast.tipo === 'exito' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.mensaje}
          </div>
        )}

        {tab === 'resumen' && (
          <ResumenSection
            complejos={complejos}
            cargandoComplejos={cargandoComplejos}
            version={version}
          />
        )}

        {tab === 'complejos' && (
          <ComplejosSection
            complejos={complejos}
            cargandoComplejos={cargandoComplejos}
            onCargarComplejos={cargarComplejos}
            irACanchas={irACanchas}
            mostrarToast={mostrarToast}
          />
        )}

        {tab === 'canchas' && (
          <CanchasSection
            complejos={complejos}
            cargandoComplejos={cargandoComplejos}
            complejoSeleccionado={complejoSeleccionado}
            onCambiarComplejo={cambiarComplejo}
            version={version}
            notificarCambio={notificarCambio}
            irATurnos={irATurnos}
            mostrarToast={mostrarToast}
          />
        )}

        {tab === 'turnos' && (
          <TurnosSection
            complejos={complejos}
            cargandoComplejos={cargandoComplejos}
            complejoSeleccionado={complejoSeleccionado}
            canchaSeleccionada={canchaSeleccionada}
            onCambiarComplejo={cambiarComplejo}
            onCambiarCancha={cambiarCancha}
            version={version}
            notificarCambio={notificarCambio}
            mostrarToast={mostrarToast}
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard
