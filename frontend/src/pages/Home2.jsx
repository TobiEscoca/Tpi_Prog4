import { useEffect, useState } from "react";
import CanchaCard from "../components/CardCancha";
import { api } from "../services/api";

const Home = () => {
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
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 text-lg">Cargando canchas...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🏟️ Canchas disponibles
      </h1>

      {canchas.length === 0 ? (
        <p className="text-center text-gray-500">No hay canchas disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {canchas.map((cancha) => (
            <CanchaCard key={cancha.idCancha} cancha={cancha} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;