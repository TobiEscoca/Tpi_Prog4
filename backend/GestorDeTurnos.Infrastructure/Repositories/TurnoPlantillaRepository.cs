using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class TurnoPlantillaRepository : GenericRepository<TurnoPlantilla>, ITurnoPlantillaRepository
    {
        public TurnoPlantillaRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<TurnoPlantilla>> GetByCanchaAsync(int idCancha)
        {
            return (await _dbSet
                .Where(p => p.IdCancha == idCancha)
                .ToListAsync())
                .OrderBy(p => p.DiaSemana)
                .ThenBy(p => p.HoraInicio);
        }

        public async Task<IEnumerable<TurnoPlantilla>> GetByCanchaYDiaAsync(int idCancha, int diaSemana)
        {
            return (await _dbSet
                .Where(p => p.IdCancha == idCancha && p.DiaSemana == diaSemana)
                .ToListAsync())
                .OrderBy(p => p.HoraInicio);
        }

        public async Task<IEnumerable<TurnoPlantilla>> GetActivasPorCanchaAsync(int idCancha)
        {
            return (await _dbSet
                .Where(p => p.IdCancha == idCancha && p.Activo)
                .ToListAsync())
                .OrderBy(p => p.DiaSemana)
                .ThenBy(p => p.HoraInicio);
        }
    }
}
