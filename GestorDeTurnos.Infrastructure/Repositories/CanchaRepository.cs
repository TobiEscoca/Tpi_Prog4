using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class CanchaRepository : GenericRepository<Cancha>, ICanchaRepository
    {
        public CanchaRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Cancha>> GetByComplejoAsync(int idComplejo)
        {
            return await _dbSet.Where(c => c.IdComplejo == idComplejo).ToListAsync();
        }

        public async Task<IEnumerable<Cancha>> GetActivasByComplejoAsync(int idComplejo)
        {
            return await _dbSet.Where(c => c.IdComplejo == idComplejo && c.Activo).ToListAsync();
        }
    }
}