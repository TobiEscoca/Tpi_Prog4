import React from 'react'
import SearchBar from '../components/Searchbar'

function Hero({ onSearch }) {
  return (
    <section className="bg-green-600 py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Busca tu cancha preferida
        </h1>

        <SearchBar onSearch={onSearch} />
      </div>
    </section>
  )
}

export default Hero