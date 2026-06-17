using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Services
{
    public class NotificacionService
    {
        private readonly INotificacionRepository _notificacionRepository;

        public NotificacionService(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task<IEnumerable<Notificacion>> GetAllAsync()
        {
            return await _notificacionRepository.GetAllAsync();
        }

        public async Task<Notificacion?> GetByIdAsync(int id)
        {
            return await _notificacionRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Notificacion>> GetByTurnoAsync(int idTurno)
        {
            return await _notificacionRepository.GetByTurnoAsync(idTurno);
        }

        public async Task AddAsync(Notificacion notificacion)
        {
            await _notificacionRepository.AddAsync(notificacion);
        }

        public async Task DeleteAsync(int id)
        {
            await _notificacionRepository.DeleteAsync(id);
        }
    }
}