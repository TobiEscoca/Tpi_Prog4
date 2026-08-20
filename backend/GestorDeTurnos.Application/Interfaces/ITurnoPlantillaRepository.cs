using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces
{
    public interface ITurnoPlantillaRepository : IGenericRepository<TurnoPlantilla>
    {
        Task<IEnumerable<TurnoPlantilla>> GetByCanchaAsync(int idCancha);
        Task<IEnumerable<TurnoPlantilla>> GetByCanchaYDiaAsync(int idCancha, int diaSemana);
        Task<IEnumerable<TurnoPlantilla>> GetActivasPorCanchaAsync(int idCancha);
    }
}
