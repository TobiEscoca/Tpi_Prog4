const CardCancha = ({ cancha }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      
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
      <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
        Ver turnos disponibles
      </button>

    </div>
  );
};

export default CardCancha;