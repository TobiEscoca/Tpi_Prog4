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
            return await _dbSet.Where(t => t.IdCancha == idCancha).Include(t => t.Cancha).Include(t => t.Cliente).ToListAsync();
        }

        public async Task<IEnumerable<Turno>> GetByCanchaYFechaAsync(int idCancha, DateTime fecha)
        {
            var dia = fecha.Date;
            return await _dbSet.Where(t => t.IdCancha == idCancha && t.FechaHoraInicio.Date == dia)
                .Include(t => t.Cancha)
                .Include(t => t.Cliente)
                .OrderBy(t => t.FechaHoraInicio)
                .ToListAsync();
        }

        public async Task<bool> ExisteSolapamientoAsync(int idCancha, DateTime inicio, DateTime fin)
        {
            return await _dbSet.AnyAsync(t =>
                t.IdCancha == idCancha &&
                t.Estado != EstadoTurno.Cancelado &&
                t.FechaHoraInicio < fin &&
                t.FechaHoraFin > inicio);
        }

        public async Task<IEnumerable<Turno>> GetPendientesVencidosAsync()
        {
            return await _dbSet
                .Where(t => t.Estado == EstadoTurno.Pendiente && t.FechaHoraInicio <= DateTime.Now)
                .ToListAsync();
        }

        public async Task<IEnumerable<Turno>> GetRenovablesDeDiasAnterioresAsync()
        {
            return await _dbSet
                .Where(t => (t.Estado == EstadoTurno.Expirado || t.Estado == EstadoTurno.Confirmado)
                         && t.FechaHoraInicio.Date < DateTime.Today)
                .ToListAsync();
        }

        public async Task<bool> ExisteTurnoParaHoyAsync(int idCancha, TimeSpan horaInicio, TimeSpan horaFin)
        {
            var hoy = DateTime.Today;
            return await _dbSet.AnyAsync(t =>
                t.IdCancha == idCancha &&
                t.FechaHoraInicio.Date == hoy &&
                t.FechaHoraInicio.TimeOfDay == horaInicio &&
                t.FechaHoraFin.TimeOfDay == horaFin);
        }

    }
}