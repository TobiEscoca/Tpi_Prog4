using System.Collections.Generic;
using System.Threading.Tasks;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces
{
    public interface ICanchaRepository : IGenericRepository<Cancha>
    {
        Task<IEnumerable<Cancha>> GetByComplejoAsync(int idComplejo);
        Task<IEnumerable<Cancha>> GetActivasByComplejoAsync(int idComplejo);
    }
}