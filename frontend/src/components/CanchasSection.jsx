import { useEffect, useState } from "react";
import CanchaCard from "./CardCancha";
import { api } from "../services/api";

const CanchasSection = () => {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {canchas.length === 0 ? (
        <p className="text-center text-gray-500">No hay canchas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {canchas.map((cancha) => (
            <CanchaCard key={cancha.idCancha} cancha={cancha} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CanchasSection;
