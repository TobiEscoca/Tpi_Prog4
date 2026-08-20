import { useEffect, useState } from 'react'
import Modal from './Modal'
import { api } from '../../services/api'

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'

function CanchasSection({
  complejos,
  cargandoComplejos,
  complejoSeleccionado,
  onCambiarComplejo,
  version,
  notificarCambio,
  irAHorarios,
  mostrarToast,
}) {
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nombre: '', precioHora: '', urlImagen: '' })
  const [activo, setActivo] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [horarios, setHorarios] = useState({})
  const [diasSeleccionados, setDiasSeleccionados] = useState([])

  const complejo = complejos.find((c) => c.idComplejo === complejoSeleccionado) || null

  useEffect(() => {
    let activo2 = true

    if (!complejoSeleccionado) {
      setCanchas([])
      setLoading(false)
      setError(null)
      return () => { activo2 = false }
    }

    setLoading(true)
    setError(null)

    api.get(`/api/Cancha/BuscarPorComplejo/${complejoSeleccionado}`)
      .then((data) => {
        if (activo2) setCanchas(data)
      })
      .catch((err) => {
        if (activo2) setError(err.response?.data || err.message || 'Error al cargar las canchas')
      })
      .finally(() => {
        if (activo2) setLoading(false)
      })

    return () => { activo2 = false }
  }, [complejoSeleccionado, version])

  const abrirCrear = () => {
    setForm({ nombre: '', precioHora: '', urlImagen: '' })
    setActivo(true)
    setHorarios({})
    setDiasSeleccionados([])
    setModal({ modo: 'crear' })
  }

  const abrirEditar = (cancha) => {
    setForm({
      nombre: cancha.nombre,
      precioHora: String(cancha.precioHora),
      urlImagen: cancha.urlImagen ?? '',
    })
    setActivo(cancha.activo)
    setModal({ modo: 'editar', cancha })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (modal.modo === 'crear') {
        const horariosPayload = {}
        for (const dia of diasSeleccionados) {
          horariosPayload[dia] = {
            apertura: horarios[dia]?.apertura || '07:00',
            cierre: horarios[dia]?.cierre || '23:00',
          }
        }
        await api.post('/api/Cancha/CrearCancha', {
          idComplejo: complejoSeleccionado,
          nombre: form.nombre,
          precioHora: parseFloat(form.precioHora),
          urlImagen: form.urlImagen?.trim() || null,
          horarios: Object.keys(horariosPayload).length > 0 ? horariosPayload : null,
        })
        mostrarToast('Cancha creada correctamente')
      } else {
        await api.put(`/api/Cancha/ActualizarCancha/${modal.cancha.idCancha}`, {
          nombre: form.nombre,
          precioHora: parseFloat(form.precioHora),
          urlImagen: form.urlImagen?.trim() || null,
          activo,
        })
        mostrarToast('Cancha actualizada correctamente')
      }
      setModal(null)
      notificarCambio()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al guardar la cancha', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (cancha) => {
    if (!window.confirm(`¿Eliminar la cancha "${cancha.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/api/Cancha/EliminarCancha/${cancha.idCancha}`)
      mostrarToast('Cancha eliminada correctamente')
      notificarCambio()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al eliminar la cancha', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Canchas</h2>
          <p className="text-sm text-gray-500">Administrá las canchas de tus complejos</p>
        </div>
        <button onClick={abrirCrear} disabled={!complejoSeleccionado} className="button-authr disabled:opacity-40 disabled:cursor-not-allowed">
          Nueva cancha
        </button>
      </div>

      <div className="mb-6">
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

      {cargandoComplejos && <p className="text-gray-500 text-sm py-10 text-center">Cargando complejos...</p>}

      {!cargandoComplejos && !complejoSeleccionado && (
        <p className="text-gray-500 text-sm py-10 text-center">Seleccioná un complejo para ver sus canchas.</p>
      )}

      {complejoSeleccionado && loading && (
        <p className="text-gray-500 text-sm py-10 text-center">Cargando canchas...</p>
      )}

      {complejoSeleccionado && error && (
        <p className="text-red-500 text-sm py-10 text-center">{error}</p>
      )}

      {complejoSeleccionado && !loading && !error && canchas.length === 0 && (
        <p className="text-gray-500 text-sm py-10 text-center">
          Este complejo no tiene canchas todavía. Creá la primera.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {canchas.map((cancha) => (
          <div key={cancha.idCancha} className="card p-0 overflow-hidden flex flex-col">
            <img
              src={cancha.urlImagen?.trim() || PLACEHOLDER_IMG}
              alt={cancha.nombre}
              className="w-full h-36 object-cover"
              onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
            />

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-gray-900">{cancha.nombre}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                  cancha.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {cancha.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Precio por hora: <span className="font-semibold text-gray-800">${cancha.precioHora}</span>
              </p>
              <p className="text-xs text-gray-400">{complejo?.nombre ?? cancha.nombreComplejo}</p>

              <div className="mt-auto flex flex-wrap gap-2">
                <button onClick={() => irAHorarios(cancha.idCancha)} className="button-authl">
                  Horarios
                </button>
                <button onClick={() => abrirEditar(cancha)} className="button-authl">
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cancha)}
                  className="text-sm font-medium text-red-600 bg-red-100 rounded-full px-4 py-2 hover:bg-red-200 cursor-pointer transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.modo === 'crear' ? 'Nueva cancha' : 'Editar cancha'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="input-field"
                placeholder="Cancha N°1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio por hora</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={form.precioHora}
                onChange={(e) => setForm({ ...form, precioHora: e.target.value })}
                className="input-field"
                placeholder="8000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
              <input
                type="url"
                value={form.urlImagen}
                onChange={(e) => setForm({ ...form, urlImagen: e.target.value })}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            {modal.modo === 'crear' && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Días de atención</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { id: '1', label: 'Lun' },
                    { id: '2', label: 'Mar' },
                    { id: '3', label: 'Mié' },
                    { id: '4', label: 'Jue' },
                    { id: '5', label: 'Vie' },
                    { id: '6', label: 'Sáb' },
                    { id: '0', label: 'Dom' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setDiasSeleccionados((prev) =>
                          prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]
                        )
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                        diasSeleccionados.includes(d.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                {diasSeleccionados.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {diasSeleccionados.map((dia) => {
                      const labels = { '0': 'Dom', '1': 'Lun', '2': 'Mar', '3': 'Mié', '4': 'Jue', '5': 'Vie', '6': 'Sáb' }
                      return (
                        <div key={dia} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 w-8 shrink-0">{labels[dia]}</span>
                          <input
                            type="time"
                            value={horarios[dia]?.apertura || '07:00'}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, [dia]: { ...prev[dia], apertura: e.target.value } }))}
                            className="input-field text-xs min-w-0 w-full"
                          />
                          <span className="text-gray-400 shrink-0">-</span>
                          <input
                            type="time"
                            value={horarios[dia]?.cierre || '23:00'}
                            onChange={(e) => setHorarios((prev) => ({ ...prev, [dia]: { ...prev[dia], cierre: e.target.value } }))}
                            className="input-field text-xs min-w-0 w-full"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {modal.modo === 'editar' && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
                Activa
              </label>
            )}

            <button type="submit" disabled={guardando} className="btn-primary">
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default CanchasSection
