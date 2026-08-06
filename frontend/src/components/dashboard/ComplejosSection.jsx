import { useState } from 'react'
import Modal from './Modal'
import { api } from '../../services/api'

function ComplejosSection({ complejos, cargandoComplejos, onCargarComplejos, irACanchas, mostrarToast }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' })
  const [activo, setActivo] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const abrirCrear = () => {
    setForm({ nombre: '', direccion: '', telefono: '' })
    setActivo(true)
    setModal({ modo: 'crear' })
  }

  const abrirEditar = (complejo) => {
    setForm({
      nombre: complejo.nombre,
      direccion: complejo.direccion,
      telefono: complejo.telefono ?? '',
    })
    setActivo(complejo.activo)
    setModal({ modo: 'editar', complejo })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const telefono = form.telefono?.trim() || null

      if (modal.modo === 'crear') {
        await api.post('/api/Complejo/CrearComplejo', {
          nombre: form.nombre,
          direccion: form.direccion,
          telefono,
        })
        mostrarToast('Complejo creado correctamente')
      } else {
        await api.put(`/api/Complejo/ActualizarComplejo/${modal.complejo.idComplejo}`, {
          nombre: form.nombre,
          direccion: form.direccion,
          telefono,
          activo,
        })
        mostrarToast('Complejo actualizado correctamente')
      }
      setModal(null)
      onCargarComplejos()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al guardar el complejo', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (complejo) => {
    if (!window.confirm(`¿Eliminar el complejo "${complejo.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/api/Complejo/EliminarComplejo/${complejo.idComplejo}`)
      mostrarToast('Complejo eliminado correctamente')
      onCargarComplejos()
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al eliminar el complejo', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mis complejos</h2>
          <p className="text-sm text-gray-500">Creá, editá y administrá tus complejos</p>
        </div>
        <button onClick={abrirCrear} className="button-authr">
          Nuevo complejo
        </button>
      </div>

      {cargandoComplejos && <p className="text-gray-500 text-sm py-10 text-center">Cargando complejos...</p>}

      {!cargandoComplejos && complejos.length === 0 && (
        <p className="text-gray-500 text-sm py-10 text-center">
          Todavía no tenés complejos. Creá uno para empezar.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {complejos.map((complejo) => (
          <div key={complejo.idComplejo} className="card flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-gray-900">{complejo.nombre}</h3>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                complejo.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {complejo.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <p>{complejo.direccion}</p>
              <p>{complejo.telefono ?? 'Sin teléfono'}</p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              <button onClick={() => irACanchas(complejo.idComplejo)} className="button-authl">
                Ver canchas
              </button>
              <button onClick={() => abrirEditar(complejo)} className="button-authl">
                Editar
              </button>
              <button
                onClick={() => handleEliminar(complejo)}
                className="text-sm font-medium text-red-600 bg-red-100 rounded-full px-4 py-2 hover:bg-red-200 cursor-pointer transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal.modo === 'crear' ? 'Nuevo complejo' : 'Editar complejo'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="input-field"
                placeholder="Complejo Los Amigos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="input-field"
                placeholder="Av. Siempre Viva 742"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="input-field"
                placeholder="11 5555 5555"
              />
            </div>

            {modal.modo === 'editar' && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
                Activo
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

export default ComplejosSection
