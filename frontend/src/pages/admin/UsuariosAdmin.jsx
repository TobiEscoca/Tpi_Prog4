import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmDialog } from '../../components/admin/ConfirmDialog'
import { Toast } from '../../components/admin/Toast'
import { ROLES, rolLabel, ROL_COLORS } from '../../components/admin/roles'

const EMPTY_FORM = { nombre: '', email: '', password: '', rolUsuario: 'Cliente' }

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)
  const [complejos, setComplejos] = useState(null)

  const cargar = async () => {
    setLoading(true)
    try {
      const data = await api.get('/api/Usuario/ObtenerUsuarios')
      setUsuarios(data)
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
        await api.post('/api/Usuario/Crear-usuario-admin', {
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rolUsuario: form.rolUsuario,
        })
        mostrarToast('Usuario creado correctamente')
      } else {
        await api.put(`/api/Usuario/ActualizarUsuario/${form.idUsuario}`, {
          nombre: form.nombre,
          email: form.email,
          rolUsuario: form.rolUsuario,
          activo: form.activo,
        })
        mostrarToast('Usuario actualizado correctamente')
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
      await api.delete(`/api/Usuario/EliminarUsuario/${aBorrar.idUsuario}`)
      setABorrar(null)
      mostrarToast('Usuario eliminado correctamente')
      await cargar()
    } catch (err) {
      setABorrar(null)
      mostrarToast(err.response?.data ?? err.message, 'error')
    } finally {
      setBorrando(false)
    }
  }

  const verComplejos = async (usuario) => {
    try {
      const data = await api.get(`/api/Complejo/BuscarPorDueno/${usuario.idUsuario}`)
      setComplejos({ usuario, lista: data })
    } catch (err) {
      mostrarToast(err.response?.data ?? err.message, 'error')
    }
  }

  const abrirEditar = (usuario) => {
    setForm({
      modo: 'editar',
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rolUsuario: usuario.rol,
      activo: usuario.activo,
    })
  }

  const fecha = (f) => (f ? new Date(f).toLocaleDateString('es-AR') : '—')

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
          <p className="text-sm text-gray-500 mt-1">Gestioná cuentas, roles y dueños de complejos</p>
        </div>
        <button
          onClick={() => setForm({ modo: 'crear', ...EMPTY_FORM })}
          className="btn-primary !w-auto px-5"
        >
          + Nuevo usuario
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-lg py-10 text-center">Cargando usuarios...</p>
      ) : error ? (
        <p className="text-red-500 text-lg py-10 text-center">{error}</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Registro</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">No hay usuarios.</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.idUsuario} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{u.nombre}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROL_COLORS[u.rol] ?? 'bg-gray-100 text-gray-600'}`}>
                        {rolLabel(u.rol)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{fecha(u.fechaRegistro)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {u.rol === 'DuenoComplejo' && (
                          <button
                            onClick={() => verComplejos(u)}
                            className="text-xs font-medium text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            Ver complejos
                          </button>
                        )}
                        <button
                          onClick={() => abrirEditar(u)}
                          className="text-xs font-medium text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setABorrar(u)}
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

      {/* Modal crear/editar */}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.modo === 'crear' ? 'Nuevo usuario' : 'Editar usuario'}>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            {form.modo === 'crear' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                className="input-field"
                value={form.rolUsuario}
                onChange={(e) => setForm({ ...form, rolUsuario: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {form.modo === 'editar' && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  className="w-4 h-4 accent-green-600"
                />
                Activo
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
        title="Eliminar usuario"
        message={`¿Seguro que querés eliminar a ${aBorrar?.nombre ?? ''}? Se eliminarán también sus complejos, canchas y turnos relacionados.`}
        onConfirm={handleBorrar}
        onCancel={() => setABorrar(null)}
        loading={borrando}
      />

      {/* Complejos del dueño */}
      <Modal open={!!complejos} onClose={() => setComplejos(null)} title={`Complejos de ${complejos?.usuario?.nombre ?? ''}`}>
        {complejos?.lista?.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">Este dueño no tiene complejos.</p>
        ) : (
          <div className="space-y-3">
            {complejos?.lista?.map((c) => (
              <div key={c.idComplejo} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{c.nombre}</p>
                  <p className="text-sm text-gray-500">{c.direccion}</p>
                  {c.telefono && <p className="text-sm text-gray-500 mt-0.5">{c.telefono}</p>}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {c.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
