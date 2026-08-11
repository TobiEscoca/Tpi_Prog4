import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import Navbar from '../components/Navbar'
import CardCancha from '../components/CardCancha'

function ComplejoDetail() {
  const { id } = useParams()
  const [complejo, setComplejo] = useState(null)
  const [canchas, setCanchas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [todos, canchasData] = await Promise.all([
          api.get('/api/Complejo'),
          api.get(`/api/Cancha/BuscarPorComplejo/${id}`),
        ])
        const encontrado = todos.find((c) => c.idComplejo === Number(id))
        if (!encontrado) {
          setError('No existe el complejo indicado.')
        } else {
          setComplejo(encontrado)
          setCanchas(canchasData)
        }
      } catch (err) {
        setError(err.response?.data ?? err.message)
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [id])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-fade-in text-gray-400 text-lg">Cargando complejo...</div>
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

  return (
    <div>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Sección superior: Info del complejo */}
        <div className="mb-10 animate-fade-in-up">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
            complejo.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {complejo.activo ? 'Activo' : 'Inactivo'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {complejo.nombre}
          </h1>
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <p>📍 {complejo.direccion}</p>
            <p>📞 {complejo.telefono ?? 'Sin teléfono'}</p>
            {complejo.email && <p>✉️ {complejo.email}</p>}
          </div>
        </div>

        {/* Sección canchas */}
        <div className="animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Canchas</h2>
          <p className="text-sm text-gray-500 mb-6">Canchas disponibles en este complejo</p>

          {canchas.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Este complejo todavía no tiene canchas cargadas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {canchas.map((cancha) => (
                <CardCancha key={cancha.idCancha} cancha={cancha} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComplejoDetail
