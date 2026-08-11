import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Navbar from '../components/Navbar'

const formatoFecha = (f) => {
  if (!f) return '—'
  const d = new Date(f)
  return d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default function NotificacionesCliente() {
  const [notificaciones, setNotificaciones] = useState([])
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [notis, turnosData] = await Promise.all([
          api.get('/api/Notificacion/MisNotificaciones-Cliente'),
          api.get('/api/Turno/MisTurnos-Cliente'),
        ])
        setNotificaciones(notis)
        setTurnos(turnosData)
        setError(null)
      } catch (err) {
        setError(err.response?.data ?? err.message)
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [])

  const canchaDeTurno = (idTurno) => {
    const t = turnos.find((x) => x.idTurno === idTurno)
    return t ? t.nombreCancha : `Turno #${idTurno}`
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mis notificaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Avisos de tus turnos reservados y cancelaciones</p>
        </header>

        {loading ? (
          <p className="text-gray-500 text-lg py-10 text-center">Cargando notificaciones...</p>
        ) : error ? (
          <p className="text-red-500 text-lg py-10 text-center">{error}</p>
        ) : notificaciones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm py-14 px-6 text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-gray-500 text-lg">Todavía no tenés notificaciones.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto animate-fade-in-up">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Mensaje</th>
                  <th className="px-5 py-3 font-medium">Cancha</th>
                  <th className="px-5 py-3 font-medium">Fecha</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {notificaciones.map((n) => (
                  <tr key={n.idNotificacion} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 text-gray-700 max-w-xs">{n.mensaje}</td>
                    <td className="px-5 py-3 text-gray-500">{canchaDeTurno(n.idTurno)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatoFecha(n.fechaEnvio)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${n.enviado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {n.enviado ? 'Enviada' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
