import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../services/api'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'

const SLOTS = Array.from({ length: 14 }, (_, i) => {
  const h = 9 + i
  return {
    inicio: `${String(h).padStart(2, '0')}:00`,
    fin: `${String(h + 1).padStart(2, '0')}:00`,
  }
})

function formatearFechaLarga(fecha) {
  const d = new Date(fecha + 'T12:00:00')
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${dias[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`
}

function obtenerFechaISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function CanchaDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [cancha, setCancha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reservando, setReservando] = useState(null)
  const [cancelando, setCancelando] = useState(null)
  const [toast, setToast] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => obtenerFechaISO(new Date()))
  const [turnos, setTurnos] = useState([])
  const [loadingTurnos, setLoadingTurnos] = useState(false)

  useEffect(() => {
    api.get(`/api/Cancha/BuscarCanchaPorId/${id}`)
      .then(setCancha)
      .catch((err) => setError(err.message || 'Error al cargar la cancha'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    let activo = true
    setLoadingTurnos(true)
    api.get(`/api/Turno/BuscarTurnosPorCancha/${id}?fecha=${fechaSeleccionada}`)
      .then((data) => { if (activo) setTurnos(data) })
      .catch(() => { if (activo) setTurnos([]) })
      .finally(() => { if (activo) setLoadingTurnos(false) })
    return () => { activo = false }
  }, [id, fechaSeleccionada])

  const mostrarToast = useCallback((mensaje, tipo) => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 4000)
  }, [])

  function getTurnoForSlot(slot) {
    return turnos.find((t) => {
      const inicio = new Date(t.fechaHoraInicio)
      return `${String(inicio.getHours()).padStart(2, '0')}:${String(inicio.getMinutes()).padStart(2, '0')}` === `${slot.inicio}`
    }) || null
  }

  async function handleReservar(turno) {
    setReservando(turno.idTurno)
    try {
      await api.put(`/api/Turno/ConfirmarTurno/${turno.idTurno}`)
      const data = await api.get(`/api/Turno/BuscarTurnosPorCancha/${id}?fecha=${fechaSeleccionada}`)
      setTurnos(data)
      mostrarToast('Turno reservado correctamente', 'exito')
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al reservar el turno', 'error')
    } finally {
      setReservando(null)
    }
  }

  async function handleCancelar(turno) {
    setCancelando(turno.idTurno)
    try {
      await api.put(`/api/Turno/CancelarTurno/${turno.idTurno}`)
      const data = await api.get(`/api/Turno/BuscarTurnosPorCancha/${id}?fecha=${fechaSeleccionada}`)
      setTurnos(data)
      mostrarToast('Turno cancelado correctamente', 'exito')
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al cancelar el turno', 'error')
    } finally {
      setCancelando(null)
    }
  }

  function moverFecha(dias) {
    const actual = new Date(fechaSeleccionada + 'T12:00:00')
    actual.setDate(actual.getDate() + dias)
    setFechaSeleccionada(obtenerFechaISO(actual))
  }

  const diasSemana = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    diasSemana.push({
      iso: obtenerFechaISO(d),
      label: i === 0 ? 'Hoy' : `${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sábado'][d.getDay()]} ${d.getDate()}`,
    })
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-fade-in text-gray-400 text-lg">Cargando cancha...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button onClick={() => window.history.back()} className="text-green-700 underline text-sm cursor-pointer">
              Volver
            </button>
          </div>
        </div>
      </div>
    )
  }

  const imagenUrl = cancha.urlImagen?.trim() || PLACEHOLDER_IMG

  return (
    <div>
      <Navbar />

      {toast && (
        <div className={`fixed top-24 right-6 z-50 animate-slide-in-right px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
          toast.tipo === 'exito'
            ? 'bg-green-700 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.mensaje}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Sección superior: Imagen + Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 animate-fade-in-up">
          <div className="md:w-3/5">
            <img
              src={imagenUrl}
              alt={cancha.nombre}
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
              onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
            />
          </div>

          <div className="md:w-2/5 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {cancha.nombre}
            </h1>
            <p className="text-gray-500 text-sm mb-1">
              {cancha.nombreComplejo}
            </p>
            <p className="text-green-700 font-semibold text-lg mt-2">
              ${cancha.precioHora} <span className="text-sm font-normal text-gray-500">la hora</span>
            </p>
          </div>
        </div>

        {!user ? (
          <div className="animate-fade-in-up animation-delay-200 text-center py-12">
            <div className="card max-w-md mx-auto py-10 px-8">
              <svg className="w-12 h-12 text-green-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 mb-2">¿Querés reservar este turno?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Iniciá sesión o create una cuenta para ver los turnos disponibles y reservar al instante.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="btn-primary text-center"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="button-authl text-center"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Selector de fecha */}
            <div className="animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => moverFecha(-1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-semibold text-gray-800">
                  {formatearFechaLarga(fechaSeleccionada)}
                </span>
                <button
                  onClick={() => moverFecha(1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {diasSemana.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setFechaSeleccionada(d.iso)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      fechaSeleccionada === d.iso
                        ? 'bg-green-700 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sección turnos */}
            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Turnos disponibles</h2>
              <p className="text-sm text-gray-500 mb-6">Elegí un horario y reservá al instante</p>

              {loadingTurnos ? (
                <p className="text-gray-400 text-sm py-10 text-center">Cargando turnos...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {SLOTS.map((slot) => {
                    const turno = getTurnoForSlot(slot)
                    const ocupado = turno && turno.estado === 'Confirmado'
                    const disponible = turno && turno.estado === 'Pendiente'
                    const expirado = turno && turno.estado === 'Expirado'
                    const reservandoEste = reservando === turno?.idTurno
                    const cancelandoEste = cancelando === turno?.idTurno
                    const esMio = ocupado && user && turno.idCliente === user.id

                    return (
                      <div
                        key={slot.inicio}
                        className={`rounded-xl p-4 text-center border transition-all duration-200 ${
                          esMio
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : ocupado
                              ? 'bg-gray-100 border-gray-200 text-gray-400'
                              : disponible
                                ? 'bg-green-50 border-green-200 text-green-800 hover:shadow-md hover:border-green-400'
                                : expirado
                                  ? 'bg-orange-50 border-orange-200 text-orange-400'
                                  : 'bg-white border-dashed border-gray-300 text-gray-400'
                        }`}
                      >
                        <p className="font-mono text-sm font-semibold mb-1">
                          {slot.inicio} - {slot.fin}
                        </p>

                        {esMio && (
                          <>
                            <span className="text-xs text-blue-700 font-medium">Tu reserva</span>
                            <button
                              onClick={() => handleCancelar(turno)}
                              disabled={cancelandoEste}
                              className={`mt-2 block mx-auto text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                                cancelandoEste
                                  ? 'bg-red-200 text-red-400 cursor-wait'
                                  : 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                              }`}
                            >
                              {cancelandoEste ? 'Cancelando...' : 'Cancelar'}
                            </button>
                          </>
                        )}

                        {ocupado && !esMio && (
                          <span className="text-xs text-gray-400">Ocupado</span>
                        )}

                        {!turno && (
                          <span className="text-xs text-gray-400">No disponible</span>
                        )}

                        {expirado && (
                          <span className="text-xs text-orange-400">Expirado</span>
                        )}

                        {disponible && (
                          <button
                            onClick={() => handleReservar(turno)}
                            disabled={reservandoEste}
                            className={`mt-2 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                              reservandoEste
                                ? 'bg-green-200 text-green-500 cursor-wait'
                                : 'bg-green-700 text-white hover:bg-green-800 shadow-sm'
                            }`}
                          >
                            {reservandoEste ? 'Reservando...' : 'Reservar'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CanchaDetail
