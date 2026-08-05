import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CanchasSection from '../components/CanchasSection'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Buscá canchas',
    description: 'Encontrá las mejores canchas de tu zona con nuestra búsqueda rápida.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Reservá online',
    description: 'Elegí el día y horario que te convenga, todo desde tu celular.',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    ),
    title: '¡A jugar!',
    description: 'Solo queda llegar, disfrutar y pasarla bien con tus amigos.',
  },
]

function Home() {
  return (
    <div>
      <Navbar />
      <Hero onSearch={(texto) => console.log('Buscando:', texto)} />

      <CanchasSection />

      {/* Features */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3 animate-fade-in-up">
            ¿Cómo funciona?
          </h2>
          <p className="text-center text-gray-500 mb-12 animate-fade-in-up animation-delay-100">
            Reservar una cancha nunca fue tan fácil
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`card text-center animate-fade-in-up animation-delay-${(i + 2) * 100}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
