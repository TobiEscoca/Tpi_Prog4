import React from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'

const desarrolladores = [
  {
    nombre: 'Tobías Escoca',
    iniciales: 'TE',
    rol: 'Full-Stack Developer',
    bio: 'Apasionado por el desarrollo de software. Trabajó en la API REST, la autenticación JWT y la integración de todo el sistema de turnos.',
  },
  {
    nombre: 'Martín Calandra',
    iniciales: 'MC',
    rol: 'Full-Stack Developer',
    bio: 'Entusiasta de la tecnología. Participó en la arquitectura del backend, el despliegue en la nube y el desarrollo de la interfaz de usuario.',
  },
]

function Nosotros() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <section className="bg-gray-100 px-6 py-16 flex-1">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Nosotros</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Somos un equipo de desarrolladores que creó esta plataforma para simplificar la
              gestión y reserva de turnos en complejos deportivos.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {desarrolladores.map((d, i) => (
              <div
                key={d.nombre}
                className={`card text-center animate-fade-in-up animation-delay-${(i + 1) * 100}`}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-white text-2xl font-bold mb-4 shadow-md shadow-green-600/20">
                  {d.iniciales}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{d.nombre}</h2>
                <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full mb-4">
                  {d.rol}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed">{d.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Nosotros
