import Navbar from "../components/Navbar";

export default function PoliticaDePrivacidad() {
  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Política de privacidad</h1>
      <p className="mb-4">
        En CanchaApp, nos comprometemos a proteger la privacidad de nuestros usuarios. Esta política de privacidad describe cómo recopilamos, usamos y protegemos la información personal que nos proporcionas al utilizar nuestra aplicación.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Información que recopilamos</h2>
      <p className="mb-4">
        Recopilamos información personal que nos proporcionas al registrarte en nuestra aplicación, como tu nombre, dirección de correo electrónico y número de teléfono. También podemos recopilar información sobre tus reservas y preferencias de uso.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. Uso de la información</h2>
      <p className="mb-4">
        Utilizamos la información recopilada para proporcionarte nuestros servicios, procesar tus reservas, enviarte notificaciones importantes y mejorar tu experiencia en la aplicación. No compartimos tu información personal con terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley o proteger nuestros derechos.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Seguridad de la información</h2>
      <p className="mb-4">
        Implementamos medidas de seguridad para proteger tu información personal contra el acceso no autorizado, la divulgación o la destrucción. Sin embargo, ten en cuenta que ninguna transmisión de datos por Internet es completamente segura.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Cambios en la política de privacidad</h2>
      <p className="mb-4">
        Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Te recomendamos revisar periódicamente esta página para estar al tanto de cualquier cambio.
      </p>
      <h2 className="text-2xl font-semibold mb-4">5. Contacto</h2>
      <p className="mb-4">
        Si tienes alguna pregunta o inquietud sobre nuestra política de privacidad, no dudes en contactarnos a través de nuestro correo electrónico de soporte.
      </p>
    </div>
 </>
  )
}