import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { ConfirmDialog } from '../../components/admin/ConfirmDialog'
import { Toast } from '../../components/admin/Toast'
import { rolLabel } from '../../components/admin/roles'

const ESTADO_COLORS = {
  Pendiente: 'bg-amber-100 text-amber-700',
  Confirmado: 'bg-green-100 text-green-700',
  Cancelado: 'bg-gray-100 text-gray-600',
  Expirado: 'bg-orange-100 text-orange-700',
}

const formatoFecha = (f) => {
  if (!f) return '—'
  const d = new Date(f)
  return d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default function TurnosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [turnos, setTurnos] = useState([])
  const [idCliente, setIdCliente] = useState('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [aBorrar, setABorrar] = useState(null)
  const [aCancelar, setACancelar] = useState(null)
  const [procesando, setProcesando] = useState(false)

  const cargar = async () => {
    setLoading(true)
    try {
      const [dataUsuarios, dataTurnos] = await Promise.all([
        api.get('/api/Usuario/ObtenerUsuarios'),
        api.get('/api/Turno'),
      ])
      setUsuarios(dataUsuarios)
      setTurnos(dataTurnos)
      setError(null)
    } catch (err) {
      setError(err.response?.data ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ mensaje, tipo })
    setTimeout(() => setToast(null), 4000)
  }

  const usuarioNombre = (id) => {
    if (!id) return 'Sin cliente'
    const u = usuarios.find((x) => x.idUsuario === id)
    return u ? u.nombre : `Usuario #${id}`
  }

  const handleBorrar = async () => {
    setProcesando(true)
    try {
      await api.delete(`/api/Turno/EliminarTurno/${aBorrar.idTurno}`)
      setABorrar(null)
      mostrarToast('Turno eliminado correctamente')
      await cargar()
    } catch (err) {
      setABorrar(null)
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setProcesando(false)
    }
  }

  const handleCancelar = async () => {
    setProcesando(true)
    try {
      await api.put(`/api/Turno/CancelarTurno/${aCancelar.idTurno}`)
      setACancelar(null)
      mostrarToast('Turno cancelado correctamente')
      await cargar()
    } catch (err) {
      setACancelar(null)
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setProcesando(false)
    }
  }

  const filtrados = idCliente === 'todos' ? turnos : turnos.filter((t) => t.idCliente === Number(idCliente))

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Turnos</h2>
          <p className="text-sm text-gray-500 mt-1">Mirá qué turno reservó cada usuario</p>
        </div>
        <div className="md:w-72">
          <select
            className="input-field"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value)}
          >
            <option value="todos">Todos los usuarios</option>
            {usuarios.map((u) => (
              <option key={u.idUsuario} value={u.idUsuario}>{u.nombre} ({rolLabel(u.rol)})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-lg py-10 text-center">Cargando turnos...</p>
      ) : error ? (
        <p className="text-red-500 text-lg py-10 text-center">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Cancha</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Inicio</th>
                <th className="px-5 py-3 font-medium">Fin</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">No hay turnos.</td>
                </tr>
              ) : (
                filtrados.map((t) => (
                  <tr key={t.idTurno} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{t.nombreCancha}</td>
                    <td className="px-5 py-3 text-gray-500">{usuarioNombre(t.idCliente)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatoFecha(t.fechaHoraInicio)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatoFecha(t.fechaHoraFin)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ESTADO_COLORS[t.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {t.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {(t.estado === 'Confirmado' || t.estado === 'Expirado') && (
                          <button
                            onClick={() => setACancelar(t)}
                            className="text-xs font-medium text-amber-700 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => setABorrar(t)}
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

      <ConfirmDialog
        open={!!aBorrar}
        title="Eliminar turno"
        message={`¿Seguro que querés eliminar el turno de ${aBorrar ? usuarioNombre(aBorrar.idCliente) : ''}?`}
        onConfirm={handleBorrar}
        onCancel={() => setABorrar(null)}
        loading={procesando}
      />

      <ConfirmDialog
        open={!!aCancelar}
        title="Cancelar turno"
        message={`¿Cancelar el turno de ${aCancelar ? usuarioNombre(aCancelar.idCliente) : ''}? Quedará libre para que otro cliente lo reserve.`}
        onConfirm={handleCancelar}
        onCancel={() => setACancelar(null)}
        loading={procesando}
      />
    </div>
  )
}
