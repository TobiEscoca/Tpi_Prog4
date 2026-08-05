using System.Collections.Generic;
using System.Threading.Tasks;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces
{
    public interface IComplejoRepository : IGenericRepository<Complejo>
    {
        Task<IEnumerable<Complejo>> GetByDuenoAsync(int idDueno);
        Task<IEnumerable<Complejo>> GetActivosAsync();
    }
}



