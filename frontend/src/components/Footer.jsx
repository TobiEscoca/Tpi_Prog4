import React from 'react'

export const Footer = () => {
  return (
    <>
    <div className="bg-gray-800 text-white py-4 text-sm">
     <div className="max-w-5xl mx-auto px-4 flex md:flex-row justify-between items-center">
       
         <div className="flex flex-col gap-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-gray-400 transition-colors">Github</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Twitter(X)</a>
        </div>

        <div className="flex flex-col gap-4 mb-4 md:mb-0">

            <a href="#" className="hover:text-gray-400 transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Términos de servicio</a>

          <p className="text-center">
            &copy; {new Date().getFullYear()} CanchaApp. Todos los derechos reservados.
          </p>
          </div>
        </div>
      </div>
    </>
  )
}
