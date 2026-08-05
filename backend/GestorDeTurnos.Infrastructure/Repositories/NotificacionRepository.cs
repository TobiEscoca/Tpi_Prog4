using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class NotificacionRepository : GenericRepository<Notificacion>, INotificacionRepository
    {
        public NotificacionRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Notificacion>> GetByTurnoAsync(int idTurno)
        {
            return await _dbSet.Where(n => n.IdTurno == idTurno).ToListAsync();
        }
    }
}