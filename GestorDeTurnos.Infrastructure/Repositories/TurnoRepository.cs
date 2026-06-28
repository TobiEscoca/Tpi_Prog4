using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class TurnoRepository : GenericRepository<Turno>, ITurnoRepository
    {
        public TurnoRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Turno>> GetByClienteAsync(int idCliente)
        {
            return await _dbSet.Where(t => t.IdCliente == idCliente).Include(t => t.Cancha).ToListAsync();
        }

        public async Task<IEnumerable<Turno>> GetByCanchaAsync(int idCancha)
        {
            return await _dbSet.Where(t => t.IdCancha == idCancha).Include(t => t.Cancha).ToListAsync();
        }

        public async Task<bool> ExisteSolapamientoAsync(int idCancha, DateTime inicio, DateTime fin)
        {
            return await _dbSet.AnyAsync(t =>
                t.IdCancha == idCancha &&
                t.Estado != EstadoTurno.Cancelado &&
                t.FechaHoraInicio < fin &&
                t.FechaHoraFin > inicio);
        }
    }
}