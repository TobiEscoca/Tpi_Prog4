import React from 'react'

export const Footer = () => {
  return (
    <>
    <div className="bg-gray-800 text-white py-4 text-sm">
     <div className="max-w-5xl mx-auto px-4 flex md:flex-row justify-between items-center">
       
         <div className="flex flex-col gap-4 mb-4 md:mb-0">
            <a href="https://github.com/TobiEscoca/Tpi_Prog4" className="hover:text-gray-400 transition-colors">Repositorio</a>
            <a href="https://github.com/TobiEscoca" className="hover:text-gray-400 transition-colors">GitHub de Tobías</a>
            <a href="https://github.com/TinchoCal" className="hover:text-gray-400 transition-colors">GitHub de Martín</a>
        </div>

        <div className="flex flex-col gap-4 mb-4 md:mb-0">

            <a href="/politica-de-privacidad" className="hover:text-gray-400 transition-colors">Política de privacidad</a>
            <a href="/terminos-de-servicio" className="hover:text-gray-400 transition-colors">Términos de servicio</a>

          <p className="text-center">
            &copy; {new Date().getFullYear()} CanchaApp. Todos los derechos reservados.
          </p>
          </div>
        </div>
      </div>
    </>
  )
}
