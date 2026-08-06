import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmDialog } from '../../components/admin/ConfirmDialog'
import { Toast } from '../../components/admin/Toast'

export default function CanchasAdmin() {
  const [canchas, setCanchas] = useState([])
  const [complejos, setComplejos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const cargar = async () => {
    setLoading(true)
    try {
      const [dataCanchas, dataComplejos] = await Promise.all([
        api.get('/api/Cancha'),
        api.get('/api/Complejo'),
      ])
      setCanchas(dataCanchas)
      setComplejos(dataComplejos)
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

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (form.modo === 'crear') {
        await api.post('/api/Cancha/CrearCancha', {
          idComplejo: Number(form.idComplejo),
          nombre: form.nombre,
          precioHora: Number(form.precioHora),
          urlImagen: form.urlImagen?.trim() || null,
        })
        mostrarToast('Cancha creada correctamente')
      } else {
        await api.put(`/api/Cancha/ActualizarCancha/${form.idCancha}`, {
          nombre: form.nombre,
          precioHora: Number(form.precioHora),
          urlImagen: form.urlImagen?.trim() || null,
          activo: form.activo,
        })
        mostrarToast('Cancha actualizada correctamente')
      }
      setForm(null)
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
      await api.delete(`/api/Cancha/EliminarCancha/${aBorrar.idCancha}`)
      setABorrar(null)
      mostrarToast('Cancha eliminada correctamente')
      await cargar()
    } catch (err) {
      setABorrar(null)
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setBorrando(false)
    }
  }

  const abrirEditar = (c) => {
    setForm({
      modo: 'editar',
      idCancha: c.idCancha,
      nombre: c.nombre,
      precioHora: c.precioHora,
      urlImagen: c.urlImagen ?? '',
      activo: c.activo,
    })
  }

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Canchas</h2>
          <p className="text-sm text-gray-500 mt-1">Creá, editá y eliminá canchas por complejo</p>
        </div>
        <button
          onClick={() =>
            setForm({
              modo: 'crear',
              idComplejo: complejos[0]?.idComplejo ?? '',
              nombre: '',
              precioHora: '',
              urlImagen: '',
            })
          }
          disabled={complejos.length === 0}
          className="btn-primary !w-auto px-5 disabled:opacity-60"
        >
          + Nueva cancha
        </button>
      </div>

      {complejos.length === 0 && (
        <p className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
          No hay complejos cargados. Creá uno en la pestaña Complejos.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 text-lg py-10 text-center">Cargando canchas...</p>
      ) : error ? (
        <p className="text-red-500 text-lg py-10 text-center">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Complejo</th>
                <th className="px-5 py-3 font-medium">Precio/hora</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {canchas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-400">No hay canchas.</td>
                </tr>
              ) : (
                canchas.map((c) => (
                  <tr key={c.idCancha} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.nombre}</td>
                    <td className="px-5 py-3 text-gray-500">{c.nombreComplejo ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-500">${c.precioHora}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => abrirEditar(c)} className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg cursor-pointer">
                          Editar
                        </button>
                        <button onClick={() => setABorrar(c)} className="text-xs font-medium text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer">
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

      {/* Modal crear/editar */}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.modo === 'crear' ? 'Nueva cancha' : 'Editar cancha'}>
        {form && (
          <form onSubmit={handleGuardar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                className="input-field"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            {form.modo === 'crear' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complejo</label>
                <select
                  className="input-field"
                  value={form.idComplejo}
                  onChange={(e) => setForm({ ...form, idComplejo: e.target.value })}
                  required
                >
                  {complejos.map((co) => (
                    <option key={co.idComplejo} value={co.idComplejo}>{co.nombre} — {co.direccion}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio por hora</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="input-field"
                value={form.precioHora}
                onChange={(e) => setForm({ ...form, precioHora: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
              <input
                className="input-field"
                value={form.urlImagen}
                onChange={(e) => setForm({ ...form, urlImagen: e.target.value })}
                placeholder="https://..."
              />
            </div>
            {form.modo === 'editar' && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  className="w-4 h-4 accent-green-600"
                />
                Activa
              </label>
            )}
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

      {/* Confirmar borrado */}
      <ConfirmDialog
        open={!!aBorrar}
        title="Eliminar cancha"
        message={`¿Seguro que querés eliminar ${aBorrar?.nombre ?? ''}? Se eliminarán también sus turnos.`}
        onConfirm={handleBorrar}
        onCancel={() => setABorrar(null)}
        loading={borrando}
      />
    </div>
  )
}
