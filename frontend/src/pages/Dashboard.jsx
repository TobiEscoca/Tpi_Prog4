import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import ResumenSection from '../components/dashboard/ResumenSection'
import ComplejosSection from '../components/dashboard/ComplejosSection'
import CanchasSection from '../components/dashboard/CanchasSection'
import TurnosSection from '../components/dashboard/TurnosSection'
import { api } from '../services/api'

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'complejos', label: 'Complejos' },
  { id: 'canchas', label: 'Canchas' },
  { id: 'turnos', label: 'Turnos' },
]

function Dashboard() {
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
    <div>
      <Navbar />

      {toast && (
        <div className={`fixed top-24 right-6 z-50 animate-slide-in-right px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
          toast.tipo === 'exito' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.mensaje}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de gestión</h1>
          <p className="text-gray-500 text-sm mt-1">Administrá tus complejos, canchas y turnos</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-56 shrink-0">
            <div className="card p-3 md:sticky md:top-24">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                    tab === t.id ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
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
      </div>
    </div>
  )
}

export default Dashboard
