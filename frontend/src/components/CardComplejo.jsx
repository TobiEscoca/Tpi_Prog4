import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=500&fit=crop'

const CardComplejo = ({ complejo }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <img
        src={PLACEHOLDER_IMG}
        alt={complejo.nombre}
        className="w-full h-40 object-cover"
        onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
      />

      <div className="p-5 pt-0 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{complejo.nombre}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            complejo.activo
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {complejo.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>📍 <span className="font-medium text-gray-800">{complejo.direccion}</span></p>
          <p>📞 {complejo.telefono ?? "Sin teléfono"}</p>
        </div>

        {/* Botón */}
        <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors" onClick={() => navigate(`/complejos/${complejo.idComplejo}`)}>
          Ver canchas
        </button>
      </div>
    </div>
  );
};

export default CardComplejo;
