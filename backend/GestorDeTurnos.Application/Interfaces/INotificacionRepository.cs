using System.Collections.Generic;
using System.Threading.Tasks;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces
{
    public interface INotificacionRepository : IGenericRepository<Notificacion>
    {
        Task<IEnumerable<Notificacion>> GetByTurnoAsync(int idTurno);
    }
}