import { useEffect, useState } from 'react'
import { api } from '../../services/api'

function ResumenSection({ complejos, cargandoComplejos, version }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    const fetchResumen = async () => {
      setLoading(true)
      setError(null)
      try {
        const canchasPorComplejo = await Promise.all(
          complejos.map((c) => api.get(`/api/Cancha/BuscarPorComplejo/${c.idComplejo}`))
        )
        const canchas = canchasPorComplejo.flat()

        const turnosPorCancha = await Promise.all(
          canchas.map((ca) => api.get(`/api/Turno/BuscarTurnosPorCancha/${ca.idCancha}`))
        )

        const hoy = new Date()
        const esDeHoy = (t) => new Date(t.fechaHoraInicio).toDateString() === hoy.toDateString()
        const turnosHoy = turnosPorCancha.flat().filter(esDeHoy)

        if (activo) {
          setStats({
            complejos: complejos.length,
            canchas: canchas.length,
            pendientes: turnosHoy.filter((t) => t.estado === 'Pendiente').length,
            confirmados: turnosHoy.filter((t) => t.estado === 'Confirmado').length,
          })
        }
      } catch (err) {
        if (activo) setError(err.response?.data || err.message || 'Error al cargar el resumen')
      } finally {
        if (activo) setLoading(false)
      }
    }

    if (complejos.length === 0) {
      setStats({ complejos: 0, canchas: 0, pendientes: 0, confirmados: 0 })
      setLoading(false)
      return () => { activo = false }
    }

    fetchResumen()
    return () => { activo = false }
  }, [complejos, version])

  const tarjetas = [
    {
      label: 'Complejos',
      valor: stats?.complejos ?? '—',
      color: 'bg-green-100 text-green-700',
      icono: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      label: 'Canchas',
      valor: stats?.canchas ?? '—',
      color: 'bg-blue-100 text-blue-700',
      icono: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Turnos pendientes hoy',
      valor: stats?.pendientes ?? '—',
      color: 'bg-amber-100 text-amber-700',
      icono: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Reservas confirmadas hoy',
      valor: stats?.confirmados ?? '—',
      color: 'bg-emerald-100 text-emerald-700',
      icono: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
  ]

  if (cargandoComplejos || (loading && !stats)) {
    return <p className="text-gray-500 text-sm py-10 text-center">Cargando resumen...</p>
  }

  if (error) {
    return <p className="text-red-500 text-sm py-10 text-center">{error}</p>
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Resumen del día</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((tarjeta) => (
          <div key={tarjeta.label} className="card flex flex-col gap-3">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${tarjeta.color}`}>
              {tarjeta.icono}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{tarjeta.valor}</p>
              <p className="text-sm text-gray-500">{tarjeta.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResumenSection
