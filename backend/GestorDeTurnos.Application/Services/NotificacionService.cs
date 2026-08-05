using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Services
{
    public class NotificacionService
    {
        private readonly INotificacionRepository _notificacionRepository;
        private readonly ITurnoRepository _turnoRepository;

        public NotificacionService(
            INotificacionRepository notificacionRepository,
            ITurnoRepository turnoRepository)
        {
            _notificacionRepository = notificacionRepository;
            _turnoRepository = turnoRepository;
        }

        public async Task<IEnumerable<Notificacion>> GetAllAsync() =>
            await _notificacionRepository.GetAllAsync();

        public async Task<Notificacion?> GetByIdAsync(int id) =>
            await _notificacionRepository.GetByIdAsync(id);

        public async Task<IEnumerable<Notificacion>> GetByTurnoAsync(int idTurno) =>
            await _notificacionRepository.GetByTurnoAsync(idTurno);

        public async Task AddAsync(Notificacion notificacion) =>
            await _notificacionRepository.AddAsync(notificacion);

        public async Task DeleteAsync(int id) =>
            await _notificacionRepository.DeleteAsync(id);

        // ✅ Nuevo: filtra notificaciones por cliente via sus turnos
        public async Task<IEnumerable<Notificacion>> GetByClienteAsync(int idCliente)
        {
            var turnos = await _turnoRepository.GetByClienteAsync(idCliente);
            var idTurnos = turnos.Select(t => t.IdTurno).ToHashSet();
            var todasLasNotificaciones = await _notificacionRepository.GetAllAsync();
            return todasLasNotificaciones.Where(n => idTurnos.Contains(n.IdTurno));
        }
    }
}