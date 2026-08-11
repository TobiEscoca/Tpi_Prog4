import { useEffect, useState } from "react";
import CardComplejo from "./CardComplejo";
import { api } from "../services/api";

const ComplejosSection = () => {
  const [complejos, setComplejos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplejos = async () => {
      try {
        const data = await api.get("/api/Complejo");
        setComplejos(data);
      } catch (err) {
        setError(err.response?.data ?? err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplejos();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <p className="text-gray-500 text-lg">Cargando complejos...</p>
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
        🏟️ Complejos disponibles
      </h2>

      {complejos.length === 0 ? (
        <p className="text-center text-gray-500">No hay complejos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {complejos.map((complejo) => (
            <CardComplejo key={complejo.idComplejo} complejo={complejo} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ComplejosSection;
