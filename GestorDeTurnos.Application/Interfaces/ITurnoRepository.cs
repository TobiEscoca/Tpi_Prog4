using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces
{
    public interface ITurnoRepository : IGenericRepository<Turno>
    {
        Task<IEnumerable<Turno>> GetByClienteAsync(int idCliente);
        Task<IEnumerable<Turno>> GetByCanchaAsync(int idCancha);
        Task<bool> ExisteSolapamientoAsync(int idCancha, DateTime inicio, DateTime fin);
    }
}
