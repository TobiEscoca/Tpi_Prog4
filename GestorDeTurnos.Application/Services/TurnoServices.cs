using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Application.Services
{
    public class TurnoService
    {
        private readonly ITurnoRepository _turnoRepository;

        public TurnoService(ITurnoRepository turnoRepository)
        {
            _turnoRepository = turnoRepository;
        }

        public async Task<IEnumerable<Turno>> GetAllAsync()
        {
            return await _turnoRepository.GetAllAsync();
        }

        public async Task<Turno?> GetByIdAsync(int id)
        {
            return await _turnoRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Turno>> GetByClienteAsync(int idCliente)
        {
            return await _turnoRepository.GetByClienteAsync(idCliente);
        }

        public async Task<IEnumerable<Turno>> GetByCanchaAsync(int idCancha)
        {
            return await _turnoRepository.GetByCanchaAsync(idCancha);
        }

        public async Task AddAsync(Turno turno)
        {
            bool solapado = await _turnoRepository.ExisteSolapamientoAsync(
                turno.IdCancha, turno.FechaHoraInicio, turno.FechaHoraFin);

            if (solapado)
                throw new InvalidOperationException("Ya existe un turno en ese horario para esta cancha.");

            await _turnoRepository.AddAsync(turno);
        }

        public async Task ConfirmarAsync(int id)
        {
            var turno = await _turnoRepository.GetByIdAsync(id);
            if (turno == null)
                throw new KeyNotFoundException("Turno no encontrado.");
            if (turno.Estado != EstadoTurno.Pendiente)
                throw new InvalidOperationException("Solo se pueden confirmar turnos en estado Pendiente.");
            await _turnoRepository.UpdateAsync(turno);
        }

        public async Task CancelarAsync(int id)
        {
            var turno = await _turnoRepository.GetByIdAsync(id);
            if (turno == null)
                throw new KeyNotFoundException("Turno no encontrado.");
            if (turno.Estado == EstadoTurno.Cancelado)
                throw new InvalidOperationException("El turno ya está cancelado.");

            turno.Estado = EstadoTurno.Cancelado;
            await _turnoRepository.UpdateAsync(turno);
        }

        public async Task DeleteAsync(int id)
        {
            await _turnoRepository.DeleteAsync(id);
        }
    }
}
