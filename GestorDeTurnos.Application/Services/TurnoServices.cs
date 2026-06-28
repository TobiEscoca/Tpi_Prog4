using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Application.Services
{
    public class TurnoService
    {
        private readonly ITurnoRepository _turnoRepository;
        private readonly INotificacionRepository _notificacionRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ICanchaRepository _canchaRepository;

        public TurnoService(
            ITurnoRepository turnoRepository,
            INotificacionRepository notificacionRepository,
            IUsuarioRepository usuarioRepository,
            ICanchaRepository canchaRepository)
        {
            _turnoRepository = turnoRepository;
            _notificacionRepository = notificacionRepository;
            _usuarioRepository = usuarioRepository;
            _canchaRepository = canchaRepository;
        }

        public async Task<IEnumerable<Turno>> GetAllAsync() =>
            await _turnoRepository.GetAllAsync();

        public async Task<Turno?> GetByIdAsync(int id) =>
            await _turnoRepository.GetByIdAsync(id);

        public async Task<IEnumerable<Turno>> GetByClienteAsync(int idCliente) =>
            await _turnoRepository.GetByClienteAsync(idCliente);

        public async Task<IEnumerable<Turno>> GetByCanchaAsync(int idCancha) =>
            await _turnoRepository.GetByCanchaAsync(idCancha);

        public async Task AddAsync(Turno turno)
        {
            if (turno.FechaHoraFin <= turno.FechaHoraInicio)
                throw new InvalidOperationException("La fecha de fin debe ser posterior a la fecha de inicio.");

            var cancha = await _canchaRepository.GetByIdAsync(turno.IdCancha);
            if (cancha == null)
                throw new KeyNotFoundException("Cancha no encontrada.");

            if (!cancha.Activo)
                throw new InvalidOperationException("No se puede crear un turno para una cancha inactiva.");

            bool solapado = await _turnoRepository.ExisteSolapamientoAsync(
                turno.IdCancha, turno.FechaHoraInicio, turno.FechaHoraFin);

            if (solapado)
                throw new InvalidOperationException("Ya existe un turno en ese horario para esta cancha.");

            turno.Estado = EstadoTurno.Pendiente;
            turno.IdCliente = null;
            turno.Cancha = cancha;
            cancha.Turnos.Add(turno);

            await _turnoRepository.AddAsync(turno);
        }

        public async Task ConfirmarAsync(int id, int idCliente)
        {
            var turno = await _turnoRepository.GetByIdAsync(id);
            if (turno == null)
                throw new KeyNotFoundException("Turno no encontrado.");
            if (turno.Estado != EstadoTurno.Pendiente)
                throw new InvalidOperationException("Solo se pueden confirmar turnos en estado Pendiente.");
            if (turno.IdCliente != null && turno.IdCliente != idCliente)
                throw new InvalidOperationException("Este turno ya fue reservado por otro cliente.");

            var cliente = await _usuarioRepository.GetByIdAsync(idCliente);
            if (cliente == null)
                throw new KeyNotFoundException("Cliente no encontrado.");

            turno.IdCliente = idCliente;
            turno.Estado = EstadoTurno.Confirmado;
            await _turnoRepository.UpdateAsync(turno);

            var cancha = await _canchaRepository.GetByIdAsync(turno.IdCancha);

            if (cliente != null && cancha != null)
            {
                var notificacion = new Notificacion
                {
                    Mensaje = $"Su turno en cancha {cancha.Nombre} en el horario " +
                              $"{turno.FechaHoraInicio:dd/MM/yyyy HH:mm} - {turno.FechaHoraFin:HH:mm} " +
                              $"ha sido reservado correctamente.",
                    Destinatario = cliente.Email,
                    FechaEnvio = DateTime.Now,
                    Enviado = true,
                    IdTurno = turno.IdTurno
                };

                await _notificacionRepository.AddAsync(notificacion);
            }
        }

        public async Task CancelarAsync(int id)
        {
            var turno = await _turnoRepository.GetByIdAsync(id);
            if (turno == null)
                throw new KeyNotFoundException("Turno no encontrado.");
            else if (turno.Estado == EstadoTurno.Pendiente)
                throw new InvalidOperationException("El turno ya está pendiente y no puede ser cancelado.");
            turno.IdCliente = null;
            turno.Estado = EstadoTurno.Pendiente;

            await _turnoRepository.UpdateAsync(turno);

        var cliente = await _usuarioRepository.GetByIdAsync(turno.IdCliente ?? 0);
        var cancha = await _canchaRepository.GetByIdAsync(turno.IdCancha);

            if (cliente != null && cancha != null)
            {
                var notificacion = new Notificacion
                {
                    Mensaje = $"Su turno en cancha {cancha.Nombre} en el horario " +
                              $"{turno.FechaHoraInicio:dd/MM/yyyy HH:mm} - {turno.FechaHoraFin:HH:mm} " +
                              $"ha sido cancelado.",
                    Destinatario = cliente.Email,
                    FechaEnvio = DateTime.Now,
                    Enviado = true,
                    IdTurno = turno.IdTurno
                };

                await _notificacionRepository.AddAsync(notificacion);
            }

        }

        public async Task DeleteAsync(int id) =>
            await _turnoRepository.DeleteAsync(id);
    }
}
