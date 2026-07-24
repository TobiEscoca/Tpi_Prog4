import React, { useState } from 'react'

/**
 * Barra de búsqueda reutilizable.
 *
 * Props:
 * - placeholder: texto del input (default: "Buscar canchas o complejos...")
 * - onSearch: función que recibe el texto ingresado al buscar (Enter o click en la lupa)
 * - onChange: opcional, si querés reaccionar a cada tecla (ej: búsqueda en vivo)
 */
function SearchBar({ placeholder = 'Buscar canchas o complejos...', onSearch, onChange }) {
  const [query, setQuery] = useState('')

  const handleChange = (e) => {
    setQuery(e.target.value)
    onChange?.(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />

      <button type="submit" className="search-submit">
        Buscar
      </button>
    </form>
  )
}

export default SearchBar