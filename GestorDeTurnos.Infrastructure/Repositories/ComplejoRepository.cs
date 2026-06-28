using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class ComplejoRepository : GenericRepository<Complejo>, IComplejoRepository
    {
        public ComplejoRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Complejo>> GetByDuenoAsync(int idDueno)
        {
            return await _dbSet.Where(c => c.IdDueno == idDueno)
                .Include(c => c.Canchas)
                .ToListAsync();
        }

        public async Task<IEnumerable<Complejo>> GetActivosAsync()
        {
            return await _dbSet.Where(c => c.Activo)
                .Include(c => c.Canchas)
                .ToListAsync();
        }
    }
}