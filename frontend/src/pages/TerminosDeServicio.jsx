import React from 'react'
import Navbar from '../components/Navbar'

export default function TerminosDeServicio () {
  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Términos de Servicio</h1>
      <p className="mb-4">
        Bienvenido a nuestra aplicación de reservas de canchas y complejos deportivos. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones:
      </p>
      <ol className="list-decimal list-inside mb-4">
        <li className="mb-2">
          <strong>Uso de la Plataforma:</strong> La plataforma está destinada únicamente para la reserva de canchas y complejos deportivos. Cualquier otro uso está prohibido.
        </li>
        <li className="mb-2">
          <strong>Responsabilidad del Usuario:</strong> Los usuarios son responsables de proporcionar información precisa y actualizada al registrarse y realizar reservas.
        </li>
        <li className="mb-2">
          <strong>Política de Cancelación:</strong> Las cancelaciones deben realizarse de acuerdo con la política establecida por cada cancha o complejo deportivo. La plataforma no se hace responsable de las políticas individuales de cada establecimiento.
        </li>
        <li className="mb-2">
          <strong>Propiedad Intelectual:</strong> Todo el contenido de la plataforma, incluyendo textos, imágenes y logotipos, está protegido por derechos de autor y no puede ser utilizado sin autorización.
        </li>
        <li className="mb-2">
          <strong>Modificaciones a los Términos:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento. Se recomienda revisar periódicamente esta sección para estar al tanto de cualquier cambio.
        </li>
      </ol>
      <p>
        Al utilizar nuestra plataforma, aceptas estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, te recomendamos no utilizar nuestros servicios.
      </p>
    </div>
  </>
  )
}
