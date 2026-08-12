import { useEffect, useState } from "react";
import CanchaCard from "./CardCancha";
import { api } from "../services/api";

const CanchasSection = ({ verMas = false, busqueda = '' }) => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibles, setVisibles] = useState(3);

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const data = await api.get("/api/Cancha");
        setCanchas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCanchas();
  }, []);

  const termino = busqueda.trim().toLowerCase();
  const resultados = termino
    ? canchas.filter((c) =>
        (c.nombre ?? '').toLowerCase().includes(termino) ||
        (c.nombreComplejo ?? '').toLowerCase().includes(termino)
      )
    : canchas;

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-gray-500 text-lg">Cargando canchas...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  return (
    <section className="bg-gray-100 px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
        🏟️ Canchas disponibles
      </h2>

      {resultados.length === 0 ? (
        <p className="text-center text-gray-500">
          {termino ? `No se encontraron canchas para "${busqueda.trim()}".` : "No hay canchas disponibles."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {(verMas ? resultados.slice(0, visibles) : resultados).map((cancha) => (
              <CanchaCard key={cancha.idCancha} cancha={cancha} />
            ))}
          </div>

          {verMas && (
            <div className="flex justify-center mt-10 gap-3">
              {visibles < resultados.length && (
                <button
                  onClick={() => setVisibles((v) => v + 3)}
                  className="text-sm font-medium text-white bg-green-700 rounded-full px-6 py-2.5 shadow-sm shadow-green-700/20 cursor-pointer hover:bg-green-800 hover:shadow-md hover:shadow-green-700/30 transition-colors"
                >
                  Ver más
                </button>
              )}
              {visibles > 3 && (
                <button
                  onClick={() => setVisibles(3)}
                  className="text-sm font-medium text-green-800 bg-green-200 rounded-full px-6 py-2.5 cursor-pointer hover:bg-green-300 transition-colors"
                >
                  Ver menos
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CanchasSection;
