import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmDialog } from '../../components/admin/ConfirmDialog'
import { Toast } from '../../components/admin/Toast'

const formatoFecha = (f) => {
  if (!f) return '—'
  const d = new Date(f)
  return d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default function NotificacionesAdmin() {
  const [notificaciones, setNotificaciones] = useState([])
  const [turnos, setTurnos] = useState([])
  const [idTurnoFiltro, setIdTurnoFiltro] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const cargarTurnos = async () => {
    try {
      setTurnos(await api.get('/api/Turno'))
    } catch (err) {
      mostrarToast(err.response?.data ?? err.message, 'error')
    }
  }

  const cargar = async () => {
    setLoading(true)
    try {
      const endpoint =
        idTurnoFiltro === 'todos'
          ? '/api/Notificacion'
          : `/api/Notificacion/BuscarNotificacionesPorTurno/${idTurnoFiltro}`
      setNotificaciones(await api.get(endpoint))
      setError(null)
    } catch (err) {
      setError(err.response?.data ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTurnos()
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idTurnoFiltro])

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 4000)
  }

  const canchaDeTurno = (idTurno) => {
    const t = turnos.find((x) => x.idTurno === idTurno)
    return t ? t.nombreCancha : `Turno #${idTurno}`
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      await api.post('/api/Notificacion/CrearNotificacion', {
        idTurno: Number(form.idTurno),
        mensaje: form.mensaje,
        destinatario: form.destinatario,
        enviado: form.enviado,
        fechaEnvio: form.enviado ? new Date().toISOString() : null,
      })
      setForm(null)
      mostrarToast('Notificación creada correctamente')
      await cargar()
    } catch (err) {
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setGuardando(false)
    }
  }

  const handleBorrar = async () => {
    setBorrando(true)
    try {
      await api.delete(`/api/Notificacion/EliminarNotificacion/${aBorrar.idNotificacion}`)
      setABorrar(null)
      mostrarToast('Notificación eliminada correctamente')
      await cargar()
    } catch (err) {
      setABorrar(null)
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setBorrando(false)
    }
  }

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
          <p className="text-sm text-gray-500 mt-1">Enviadas a clientes cuando reservan o cancelan</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input-field md:w-64"
            value={idTurnoFiltro}
            onChange={(e) => setIdTurnoFiltro(e.target.value)}
          >
            <option value="todos">Todas</option>
            {turnos.map((t) => (
              <option key={t.idTurno} value={t.idTurno}>{canchaDeTurno(t.idTurno)}</option>
            ))}
          </select>
          <button
            onClick={() => setForm({ idTurno: turnos[0]?.idTurno ?? '', mensaje: '', destinatario: '', enviado: true })}
            disabled={turnos.length === 0}
            className="btn-primary !w-auto px-5 disabled:opacity-60"
          >
            + Nueva
          </button>
        </div>
      </div>

      {turnos.length === 0 && (
        <p className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
          No hay turnos para asociar una notificación.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 text-lg py-10 text-center">Cargando notificaciones...</p>
      ) : error ? (
        <p className="text-red-500 text-lg py-10 text-center">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Mensaje</th>
                <th className="px-5 py-3 font-medium">Turno</th>
                <th className="px-5 py-3 font-medium">Destinatario</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">No hay notificaciones.</td>
                </tr>
              ) : (
                notificaciones.map((n) => (
                  <tr key={n.idNotificacion} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 text-gray-700 max-w-xs">{n.mensaje}</td>
                    <td className="px-5 py-3 text-gray-500">{canchaDeTurno(n.idTurno)}</td>
                    <td className="px-5 py-3 text-gray-500">{n.destinatario}</td>
                    <td className="px-5 py-3 text-gray-500">{formatoFecha(n.fechaEnvio)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${n.enviado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {n.enviado ? 'Enviada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setABorrar(n)}
                          className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear */}
      <Modal open={!!form} onClose={() => setForm(null)} title="Nueva notificación">
        {form && (
          <form onSubmit={handleGuardar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
              <select
                className="input-field"
                value={form.idTurno}
                onChange={(e) => setForm({ ...form, idTurno: e.target.value })}
                required
              >
                {turnos.map((t) => (
                  <option key={t.idTurno} value={t.idTurno}>{canchaDeTurno(t.idTurno)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario (email)</label>
              <input
                type="email"
                className="input-field"
                value={form.destinatario}
                onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                className="input-field"
                rows="3"
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.enviado}
                onChange={(e) => setForm({ ...form, enviado: e.target.checked })}
                className="w-4 h-4 accent-green-600"
              />
              Enviada
            </label>
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="btn-primary !w-auto px-6">
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!aBorrar}
        title="Eliminar notificación"
        message="¿Seguro que querés eliminar esta notificación?"
        onConfirm={handleBorrar}
        onCancel={() => setABorrar(null)}
        loading={borrando}
      />
    </div>
  )
}
