import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

const cities = ['Rosario', 'Buenos Aires', 'Córdoba']

function WeatherSection() {
  const [weathers, setWeathers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled(
      cities.map(city => api.get(`/api/Weather/ObtenerClimaPorCiudad/${city}`))
    ).then(results => {
      setWeathers(results.map((r, i) => r.status === 'fulfilled' ? r.value : null))
      setLoading(false)
    })
  }, [])

  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up">
          ¿Cómo está para jugar hoy?
        </h2>
        <p className="text-gray-500 mb-8 animate-fade-in-up animation-delay-100">
          Clima en tiempo real
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <div key={city} className="card p-6 text-center">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto" />
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                  <div className="h-6 bg-gray-200 rounded w-16 mx-auto" />
                </div>
              ) : weathers[i] ? (
                <>
                  <span className="text-3xl">
                    {weathers[i].temperature >= 30 ? '🔥' : weathers[i].temperature >= 20 ? '☀️' : '🌧️'}
                  </span>
                  <p className="font-semibold text-gray-900 mt-1">{city}</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(weathers[i].temperature)}°C</p>
                  <p className="text-sm text-gray-500">💧 {weathers[i].humidity}% · 💨 {Math.round(weathers[i].windSpeed)} km/h</p>
                </>
              ) : (
                <p className="text-gray-400 py-4">Sin datos</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WeatherSection
