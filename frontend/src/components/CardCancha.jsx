import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop'

const CardCancha = ({ cancha }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <img
        src={cancha.urlImagen?.trim() || PLACEHOLDER_IMG}
        alt={cancha.nombre}
        className="w-full h-40 object-cover"
        onError={(e) => { e.target.src = PLACEHOLDER_IMG }}
      />

      <div className="p-5 pt-0 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{cancha.nombre}</h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            cancha.activo
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {cancha.activo ? "Disponible" : "No disponible"}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>🏟️ Complejo: <span className="font-medium text-gray-800">{cancha.nombreComplejo ?? "—"}</span></p>
          <p>💰 Precio por hora: <span className="font-medium text-gray-800">${cancha.precioHora}</span></p>
        </div>

        {/* Botón */}
        <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors" onClick={() => navigate(`/cancha/${cancha.idCancha}`)}>
          Ver turnos disponibles
        </button>
      </div>
    </div>
  );
};

export default CardCancha;
