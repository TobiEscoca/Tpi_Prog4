import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'
import Navbar from '../components/Navbar'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'

const SLOTS = Array.from({ length: 14 }, (_, i) => {
  const h = 9 + i
  return {
    inicio: `${String(h).padStart(2, '0')}:00`,
    fin: `${String(h + 1).padStart(2, '0')}:00`,
  }
})

function CanchaDetail() {
  const { id } = useParams()
  const [cancha, setCancha] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reservando, setReservando] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    api.get(`/api/Cancha/BuscarCanchaPorId/${id}`)
      .then(setCancha)
      .catch((err) => setError(err.message || 'Error al cargar la cancha'))
      .finally(() => setLoading(false))
  }, [id])

  const mostrarToast = useCallback((mensaje, tipo) => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 4000)
  }, [])

  function getTurnoForSlot(slot) {
    if (!cancha?.turnos) return null
    return cancha.turnos.find((t) => {
      const inicio = new Date(t.fechaHoraInicio)
      return `${String(inicio.getHours()).padStart(2, '0')}:${String(inicio.getMinutes()).padStart(2, '0')}` === `${slot.inicio}`
    })
  }

  async function handleReservar(turno) {
    setReservando(turno.idTurno)
    try {
      await api.put(`/api/Turno/ConfirmarTurno/${turno.idTurno}`)
      const actualizada = await api.get(`/api/Cancha/BuscarCanchaPorId/${id}`)
      setCancha(actualizada)
      mostrarToast('Turno reservado correctamente', 'exito')
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al reservar el turno', 'error')
    } finally {
      setReservando(null)
    }
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

      {/* Toast */}
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
          {/* Imagen */}
          <div className="md:w-3/5">
            <img
              src={imagenUrl}
              alt={cancha.nombre}
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
              onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
            />
          </div>

          {/* Info */}
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

        {/* Sección turnos */}
        <div className="animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Turnos disponibles</h2>
          <p className="text-sm text-gray-500 mb-6">Elegí un horario y reservá al instante</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SLOTS.map((slot) => {
              const turno = getTurnoForSlot(slot)
              const ocupado = turno && turno.estado === 'Confirmado'
              const disponible = turno && turno.estado === 'Pendiente'
              const expirado = turno && turno.estado === 'Expirado'
              const reservandoEste = reservando === turno?.idTurno

              return (
                <div
                  key={slot.inicio}
                  className={`rounded-xl p-4 text-center border transition-all duration-200 ${
                    ocupado
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

                  {ocupado && (
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
        </div>
      </div>
    </div>
  )
}

export default CanchaDetail
