import { useEffect, useState } from 'react'
import Modal from './Modal'
import { api } from '../../services/api'

const ESTADO_ESTILOS = {
  Pendiente: 'bg-green-100 text-green-700',
  Confirmado: 'bg-blue-100 text-blue-700',
  Cancelado: 'bg-red-100 text-red-700',
  Expirado: 'bg-orange-100 text-orange-700',
}

function TurnosSection({
  complejos,
  cargandoComplejos,
  complejoSeleccionado,
  canchaSeleccionada,
  onCambiarComplejo,
  onCambiarCancha,
  version,
  notificarCambio,
  mostrarToast,
}) {
  const [canchas, setCanchas] = useState([])
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ horaInicio: '', horaFin: '' })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let activo = true

    if (!complejoSeleccionado) {
      setCanchas([])
      onCambiarCancha(null)
      return () => { activo = false }
    }

    api.get(`/api/Cancha/BuscarPorComplejo/${complejoSeleccionado}`)
      .then((data) => {
        if (activo) setCanchas(data)
      })
      .catch(() => {
        if (activo) setCanchas([])
      })

    return () => { activo = false }
  }, [complejoSeleccionado, onCambiarCancha])

  useEffect(() => {
    let activo = true

    if (!canchaSeleccionada) {
      setTurnos([])
      setLoading(false)
      setError(null)
      return () => { activo = false }
    }

    setLoading(true)
    setError(null)

    api.get(`/api/Turno/BuscarTurnosPorCancha/${canchaSeleccionada}`)
      .then((data) => {
        if (!activo) return
        const hoy = new Date()
        const esDeHoy = (t) => new Date(t.fechaHoraInicio).toDateString() === hoy.toDateString()
        const deHoy = data
          .filter(esDeHoy)
          .sort((a, b) => new Date(a.fechaHoraInicio) - new Date(b.fechaHoraInicio))
        setTurnos(deHoy)
      })
      .catch((err) => {
        if (activo) setError(err.response?.data || err.message || 'Error al cargar los turnos')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })

    return () => { activo = false }
  }, [canchaSeleccionada, version])

  const cancha = canchas.find((c) => c.idCancha === canchaSeleccionada) || null

  const abrirCrear = () => {
    setForm({ horaInicio: '', horaFin: '' })
    setModal(true)
  }

  const handleCrear = async (e) => {
    e.preventDefault()
    if (!form.horaInicio || !form.horaFin) {
      mostrarToast('Completá los horarios del turno', 'error')
      return
    }
    setGuardando(true)
    try {
      await api.post('/api/Turno/CrearTurno', {
        idCancha: canchaSeleccionada,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
      })
      mostrarToast('Turno creado correctamente')
      setModal(false)
      notificarCambio()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al crear el turno', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (turno) => {
    if (!window.confirm(`¿Eliminar el turno de las ${formatearHora(turno.fechaHoraInicio)}?`)) return
    try {
      await api.delete(`/api/Turno/EliminarTurno/${turno.idTurno}`)
      mostrarToast('Turno eliminado correctamente')
      notificarCambio()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al eliminar el turno', 'error')
    }
  }

  const handleCancelar = async (turno) => {
    if (!window.confirm('¿Cancelar esta reserva? El turno volverá a estar disponible.')) return
    try {
      await api.put(`/api/Turno/CancelarTurno/${turno.idTurno}`)
      mostrarToast('Reserva cancelada correctamente')
      notificarCambio()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al cancelar la reserva', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Turnos</h2>
          <p className="text-sm text-gray-500">Administrá los turnos de hoy por cancha</p>
        </div>
        <button onClick={abrirCrear} disabled={!canchaSeleccionada} className="button-authr disabled:opacity-40 disabled:cursor-not-allowed">
          Agregar turno
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complejo</label>
          <select
            value={complejoSeleccionado ?? ''}
            onChange={(e) => onCambiarComplejo(Number(e.target.value) || null)}
            className="input-field"
          >
            <option value="">Seleccioná un complejo</option>
            {complejos.map((c) => (
              <option key={c.idComplejo} value={c.idComplejo}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
          <select
            value={canchaSeleccionada ?? ''}
            onChange={(e) => onCambiarCancha(Number(e.target.value) || null)}
            className="input-field"
            disabled={!complejoSeleccionado}
          >
            <option value="">Seleccioná una cancha</option>
            {canchas.map((c) => (
              <option key={c.idCancha} value={c.idCancha}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargandoComplejos && <p className="text-gray-500 text-sm py-10 text-center">Cargando complejos...</p>}

      {!cargandoComplejos && !canchaSeleccionada && (
        <p className="text-gray-500 text-sm py-10 text-center">
          Seleccioná un complejo y una cancha para ver sus turnos.
        </p>
      )}

      {canchaSeleccionada && loading && (
        <p className="text-gray-500 text-sm py-10 text-center">Cargando turnos...</p>
      )}

      {canchaSeleccionada && error && (
        <p className="text-red-500 text-sm py-10 text-center">{error}</p>
      )}

      {canchaSeleccionada && !loading && !error && turnos.length === 0 && (
        <p className="text-gray-500 text-sm py-10 text-center">
          No hay turnos para hoy en {cancha?.nombre ?? 'esta cancha'}. Agregá uno nuevo.
        </p>
      )}

      {canchaSeleccionada && !loading && !error && turnos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {turnos.map((turno) => (
            <div key={turno.idTurno} className="card p-4 flex flex-col gap-2">
              <p className="font-mono text-sm font-semibold text-gray-900">
                {formatearHora(turno.fechaHoraInicio)} - {formatearHora(turno.fechaHoraFin)}
              </p>

              <span className={`inline-flex self-start text-xs font-semibold px-2 py-1 rounded-full ${
                ESTADO_ESTILOS[turno.estado] ?? 'bg-gray-100 text-gray-600'
              }`}>
                {traducirEstado(turno.estado)}
              </span>

              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                {turno.estado === 'Confirmado' && (
                  <button
                    onClick={() => handleCancelar(turno)}
                    className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    Cancelar reserva
                  </button>
                )}
                <button
                  onClick={() => handleEliminar(turno)}
                  className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-3 py-1.5 hover:bg-red-200 cursor-pointer transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="Agregar turno" onClose={() => setModal(false)}>
          <form onSubmit={handleCrear} className="space-y-4">
            <p className="text-sm text-gray-500">
              Turno para hoy en <span className="font-semibold text-gray-800">{cancha?.nombre}</span>.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                  className="input-field"
                  min="09:00"
                  max="22:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
                <input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                  className="input-field"
                  min="09:00"
                  max="23:00"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={guardando} className="btn-primary">
              {guardando ? 'Creando...' : 'Crear turno'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

function formatearHora(fecha) {
  const d = new Date(fecha)
  const horas = String(d.getHours()).padStart(2, '0')
  const minutos = String(d.getMinutes()).padStart(2, '0')
  return `${horas}:${minutos}`
}

function traducirEstado(estado) {
  return {
    Pendiente: 'Pendiente',
    Confirmado: 'Reservado',
    Cancelado: 'Cancelado',
    Expirado: 'Expirado',
  }[estado] ?? estado
}

export default TurnosSection
