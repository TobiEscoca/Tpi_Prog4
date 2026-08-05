import React from 'react'
import SearchBar from '../components/Searchbar'

function Hero({ onSearch }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 py-28 px-6">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/15 rounded-full animate-float animation-delay-200" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-float animation-delay-400" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up leading-tight">
          Busca tu cancha preferida
        </h1>
        <p className="text-green-100 text-base md:text-lg mb-10 animate-fade-in-up animation-delay-100">
          Reservá canchas de fútbol cerca tuyo en segundos
        </p>

        <div className="animate-fade-in-up animation-delay-200">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  )
}

export default Hero
