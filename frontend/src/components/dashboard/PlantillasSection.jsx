import { useEffect, useState } from 'react'
import { api } from '../../services/api'

const DIAS = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' },
  { id: 0, label: 'Dom' },
]

function generarSlots() {
  const slots = []
  for (let h = 7; h < 24; h++) {
    slots.push({
      inicio: `${String(h).padStart(2, '0')}:00`,
      fin: `${String(h + 1).padStart(2, '0')}:00`,
    })
  }
  return slots
}

const SLOTS = generarSlots()

export default function PlantillasSection({
  complejos,
  cargandoComplejos,
  complejoSeleccionado,
  canchaSeleccionada,
  onCambiarComplejo,
  onCambiarCancha,
  mostrarToast,
}) {
  const [canchas, setCanchas] = useState([])
  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [cambios, setCambios] = useState({})

  useEffect(() => {
    let activo = true
    if (!complejoSeleccionado) {
      setCanchas([])
      onCambiarCancha(null)
      return () => { activo = false }
    }
    api.get(`/api/Cancha/BuscarPorComplejo/${complejoSeleccionado}`)
      .then((data) => { if (activo) setCanchas(data) })
      .catch(() => { if (activo) setCanchas([]) })
    return () => { activo = false }
  }, [complejoSeleccionado, onCambiarCancha])

  useEffect(() => {
    let activo = true
    if (!canchaSeleccionada) {
      setPlantillas([])
      setLoading(false)
      setError(null)
      return () => { activo = false }
    }
    setLoading(true)
    setError(null)
    api.get(`/api/TurnoPlantilla/PorCancha/${canchaSeleccionada}`)
      .then((data) => { if (activo) { setPlantillas(data); setCambios({}) } })
      .catch((err) => { if (activo) setError(err.response?.data || err.message || 'Error al cargar plantillas') })
      .finally(() => { if (activo) setLoading(false) })
    return () => { activo = false }
  }, [canchaSeleccionada])

  const getPlantilla = (diaSemana, horaInicio) => {
    return plantillas.find(
      (p) => p.diaSemana === diaSemana && p.horaInicio === horaInicio
    ) || null
  }

  const getActivo = (diaSemana, horaInicio) => {
    const key = `${diaSemana}-${horaInicio}`
    if (key in cambios) return cambios[key]
    const p = getPlantilla(diaSemana, horaInicio)
    return p ? p.activo : false
  }

  const toggleSlot = (diaSemana, horaInicio) => {
    const key = `${diaSemana}-${horaInicio}`
    const actual = getActivo(diaSemana, horaInicio)
    setCambios((prev) => ({ ...prev, [key]: !actual }))
  }

  const toggleDiaCompleto = (diaSemana) => {
    const todosActivos = SLOTS.every((s) => getActivo(diaSemana, s.inicio))
    const nuevosCambios = {}
    SLOTS.forEach((s) => {
      const key = `${diaSemana}-${s.inicio}`
      nuevosCambios[key] = !todosActivos
    })
    setCambios((prev) => ({ ...prev, ...nuevosCambios }))
  }

  const hayCambios = Object.keys(cambios).length > 0

  const guardarCambios = async () => {
    setGuardando(true)
    try {
      const plantillasAEnviar = []
      for (const key of Object.keys(cambios)) {
        const [dia, hora] = key.split('-')
        const horaInicio = hora
        const p = getPlantilla(Number(dia), horaInicio)
        if (p) {
          plantillasAEnviar.push({
            idPlantilla: p.idPlantilla,
            activo: cambios[key],
          })
        }
      }

      if (plantillasAEnviar.length > 0) {
        await api.put('/api/TurnoPlantilla/BulkToggle', {
          plantillas: plantillasAEnviar,
        })
      }

      const data = await api.get(`/api/TurnoPlantilla/PorCancha/${canchaSeleccionada}`)
      setPlantillas(data)
      setCambios({})
      mostrarToast('Horarios guardados correctamente')
    } catch (err) {
      mostrarToast(err.response?.data || err.message || 'Error al guardar', 'error')
    } finally {
      setGuardando(false)
    }
  }

  const cancelarCambios = () => {
    setCambios({})
  }

  const cancha = canchas.find((c) => c.idCancha === canchaSeleccionada) || null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Horarios</h2>
          <p className="text-sm text-gray-500">Activá o desactivá los turnos por día y horario</p>
        </div>
        {hayCambios && (
          <div className="flex gap-2">
            <button onClick={cancelarCambios} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
              Cancelar
            </button>
            <button onClick={guardarCambios} disabled={guardando} className="button-authr">
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
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
              <option key={c.idComplejo} value={c.idComplejo}>{c.nombre}</option>
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
              <option key={c.idCancha} value={c.idCancha}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {cargandoComplejos && <p className="text-gray-500 text-sm py-10 text-center">Cargando complejos...</p>}

      {!cargandoComplejos && !canchaSeleccionada && (
        <p className="text-gray-500 text-sm py-10 text-center">Seleccioná un complejo y una cancha para configurar sus horarios.</p>
      )}

      {canchaSeleccionada && loading && (
        <p className="text-gray-500 text-sm py-10 text-center">Cargando plantillas...</p>
      )}

      {canchaSeleccionada && error && (
        <p className="text-red-500 text-sm py-10 text-center">{error}</p>
      )}

      {canchaSeleccionada && !loading && !error && plantillas.length === 0 && (
        <p className="text-gray-500 text-sm py-10 text-center">
          No hay horarios configurados para {cancha?.nombre ?? 'esta cancha'}. Creá una cancha nueva con horarios para generar las plantillas.
        </p>
      )}

      {canchaSeleccionada && !loading && !error && plantillas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-20">Hora</th>
                {DIAS.map((d) => (
                  <th key={d.id} className="px-2 py-2 text-center">
                    <button
                      onClick={() => toggleDiaCompleto(d.id)}
                      className="text-xs font-semibold text-gray-700 hover:text-green-700 cursor-pointer transition-colors"
                      title={`Activar/desactivar todo ${d.label}`}
                    >
                      {d.label}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot.inicio} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-1.5 font-mono text-xs text-gray-600 whitespace-nowrap">
                    {slot.inicio}-{slot.fin}
                  </td>
                  {DIAS.map((d) => {
                    const activo = getActivo(d.id, slot.inicio)
                    return (
                      <td key={d.id} className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => toggleSlot(d.id, slot.inicio)}
                          className={`w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                            activo
                              ? 'bg-green-500 hover:bg-green-600 shadow-sm'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          title={`${d.label} ${slot.inicio} - ${activo ? 'Activo' : 'Inactivo'}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
