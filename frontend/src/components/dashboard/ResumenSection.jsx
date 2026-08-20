import { useEffect, useState } from 'react'
import { api } from '../../services/api'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'

function parsearFechaLocal(fecha) {
  const str = typeof fecha === 'string' ? fecha : new Date(fecha).toISOString()
  const parteFecha = str.split('T')[0]
  const parteHora = (str.split('T')[1] || '00:00:00').replace('Z', '')
  const [anio, mes, dia] = parteFecha.split('-').map(Number)
  const [hora, min, seg] = parteHora.split(':').map(Number)
  return new Date(anio, mes - 1, dia, hora, min, seg || 0)
}

function formatearFechaCorta(fecha) {
  const d = parsearFechaLocal(fecha)
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${d.getDate()} ${meses[d.getMonth()]}`
}

function formatearHora(fecha) {
  const d = parsearFechaLocal(fecha)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getDiaKey(fecha) {
  const d = parsearFechaLocal(fecha)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ResumenSection({ complejos, cargandoComplejos, version }) {
  const [stats, setStats] = useState(null)
  const [turnosHoy, setTurnosHoy] = useState([])
  const [turnosFuturos, setTurnosFuturos] = useState([])
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

        const todosLosTurnos = turnosPorCancha.flat()
        const hoy = new Date()
        const hoyKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
        const esDeHoy = (t) => getDiaKey(t.fechaHoraInicio) === hoyKey

        const confirmadosHoy = todosLosTurnos.filter((t) => esDeHoy(t) && t.estado === 'Confirmado')

        const futuros = todosLosTurnos.filter((t) => {
          const d = parsearFechaLocal(t.fechaHoraInicio)
          return d > hoy && t.estado === 'Confirmado'
        })

        const porFecha = {}
        futuros.forEach((t) => {
          const key = getDiaKey(t.fechaHoraInicio)
          if (!porFecha[key]) porFecha[key] = []
          porFecha[key].push(t)
        })

        const turnosPorDia = Object.entries(porFecha)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(0, 7)

        if (activo) {
          setStats({
            complejos: complejos.length,
            canchas: canchas.length,
            pendientes: todosLosTurnos.filter((t) => esDeHoy(t) && t.estado === 'Pendiente').length,
            confirmados: confirmadosHoy.length,
          })
          setTurnosHoy(confirmadosHoy.sort((a, b) => parsearFechaLocal(a.fechaHoraInicio) - parsearFechaLocal(b.fechaHoraInicio)))
          setTurnosFuturos(turnosPorDia)
        }
      } catch (err) {
        if (activo) setError(err.response?.data || err.message || 'Error al cargar el resumen')
      } finally {
        if (activo) setLoading(false)
      }
    }

    if (complejos.length === 0) {
      setStats({ complejos: 0, canchas: 0, pendientes: 0, confirmados: 0 })
      setTurnosHoy([])
      setTurnosFuturos([])
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {turnosHoy.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-3">Reservas de hoy</h3>
          <div className="space-y-2">
            {turnosHoy.map((t) => (
              <div key={t.idTurno} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.nombreCancha}</p>
                    <p className="text-xs text-gray-500">
                      {formatearHora(t.fechaHoraInicio)} - {formatearHora(t.fechaHoraFin)}
                      {t.nombreCliente ? ` · ${t.nombreCliente}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full shrink-0">
                  Confirmado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {turnosFuturos.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Próximas reservas</h3>
          <div className="space-y-4">
            {turnosFuturos.map(([fecha, turnos]) => (
              <div key={fecha}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{formatearFechaCorta(fecha)}</p>
                <div className="space-y-2">
                  {turnos.map((t) => (
                    <div key={t.idTurno} className="card flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{t.nombreCancha}</p>
                          <p className="text-xs text-gray-500">
                            {formatearHora(t.fechaHoraInicio)} - {formatearHora(t.fechaHoraFin)}
                            {t.nombreCliente ? ` · ${t.nombreCliente}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full shrink-0">
                        Confirmado
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {turnosHoy.length === 0 && turnosFuturos.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-6">No hay reservas confirmadas.</p>
      )}
    </div>
  )
}

export default ResumenSection
