import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'

function Home() {
  return (
    <div>
        <Navbar />
        <Hero onSearch={(texto) => console.log('Buscando:', texto)} />
    </div>
  )
}

export default Home